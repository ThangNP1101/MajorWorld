import { Injectable, NotFoundException, BadRequestException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Queue } from 'bull';
import * as admin from 'firebase-admin';
import { DeviceToken, Platform } from './entities/device-token.entity';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
import { TopicSyncStatus } from './enums/topic-sync-status.enum';
import { DEVICE_TOKEN_TOPICS } from './constants/device-token-topics.constants';
import { DEVICE_TOKEN_QUEUE } from './constants/device-token-queue.constants';

interface SyncTokenJobData {
  tokenId: string;
}

interface SyncPendingJobData {}

type DeviceTokenQueueData = SyncTokenJobData | SyncPendingJobData;

interface TopicSubscriptionResult {
  topic: string;
  failedTokenIds: Set<string>;
  errorByTokenId: Map<string, string>;
  errorCodeByTokenId: Map<string, string>;
}

interface TokenSyncOutcome {
  tokenId: string;
  topics: string[];
  errorMessage: string | null;
  errorCode: string | null;
}

const DEFAULT_TOPIC_SYNC_INTERVAL_MINUTES: number = 5;
const DEFAULT_TOPIC_SYNC_BATCH_SIZE: number = 500;
const DEFAULT_TOPIC_SYNC_MAX_RETRIES: number = 5;
const DEFAULT_TOPIC_SYNC_RETRY_DELAY_MINUTES: number = 10;
const MAX_TOPIC_SUBSCRIBE_BATCH_SIZE: number = 1000;

/** Handles device token persistence and topic synchronization. */
@Injectable()
export class DeviceTokenService implements OnModuleInit {
  private readonly logger = new Logger(DeviceTokenService.name);

  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
    @InjectQueue(DEVICE_TOKEN_QUEUE.QUEUE_NAME)
    private deviceTokenQueue: Queue<DeviceTokenQueueData>,
  ) {}

  /** Initializes the repeatable topic sync job. */
  async onModuleInit(): Promise<void> {
    await this.ensureRepeatableSyncJob();
  }

  /** Gets all device tokens for admin usage. */
  async findAll(): Promise<DeviceToken[]> {
    return this.deviceTokenRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /** Gets a device token by ID for admin usage. */
  async findOne(id: string): Promise<DeviceToken> {
    const token = await this.deviceTokenRepository.findOne({ where: { id } });
    if (!token) {
      throw new NotFoundException(`Device token with ID ${id} not found`);
    }
    return token;
  }

  /** Creates a device token for admin usage. */
  async create(createDto: CreateDeviceTokenDto): Promise<DeviceToken> {
    const token = this.deviceTokenRepository.create({
      userId: createDto.userId ?? null,
      fcmToken: createDto.fcmToken,
      platform: createDto.platform,
      appVersion: createDto.appVersion ?? null,
      isActive: createDto.isActive ?? true,
      lastSeenAt: createDto.lastSeenAt ? new Date(createDto.lastSeenAt) : null,
      topicsSyncStatus: TopicSyncStatus.PENDING,
      topicsSyncedList: [],
      topicsSyncAttemptedAt: null,
      topicsSyncRetryCount: 0,
      topicsSyncError: null,
    });
    try {
      const savedToken = await this.deviceTokenRepository.save(token);
      void this.enqueueSyncToken({ tokenId: savedToken.id });
      return savedToken;
    } catch (error) {
      const errorCode: string | null = this.getErrorCode(error);
      if (errorCode === '23505') {
        throw new BadRequestException('FCM token already exists');
      }
      throw error;
    }
  }

  /** Removes a device token by ID. */
  async remove(id: string): Promise<void> {
    const token = await this.findOne(id);
    await this.deviceTokenRepository.remove(token);
  }

  /** Registers or updates a device token from mobile app. */
  async registerToken(
    registerDto: RegisterDeviceTokenDto,
  ): Promise<DeviceToken> {
    const existingToken = await this.deviceTokenRepository.findOne({
      where: { fcmToken: registerDto.fcmToken },
    });
    if (existingToken) {
      existingToken.platform = registerDto.platform;
      existingToken.appVersion = registerDto.appVersion ?? existingToken.appVersion;
      existingToken.isActive = true;
      existingToken.lastSeenAt = new Date();
      existingToken.topicsSyncStatus = TopicSyncStatus.PENDING;
      existingToken.topicsSyncedList = [];
      existingToken.topicsSyncAttemptedAt = null;
      existingToken.topicsSyncRetryCount = 0;
      existingToken.topicsSyncError = null;
      const savedToken = await this.deviceTokenRepository.save(existingToken);
      void this.enqueueSyncToken({ tokenId: savedToken.id });
      return savedToken;
    }
    const newToken = this.deviceTokenRepository.create({
      fcmToken: registerDto.fcmToken,
      platform: registerDto.platform,
      appVersion: registerDto.appVersion ?? null,
      isActive: true,
      lastSeenAt: new Date(),
      topicsSyncStatus: TopicSyncStatus.PENDING,
      topicsSyncedList: [],
      topicsSyncAttemptedAt: null,
      topicsSyncRetryCount: 0,
      topicsSyncError: null,
    });
    const savedToken = await this.deviceTokenRepository.save(newToken);
    void this.enqueueSyncToken({ tokenId: savedToken.id });
    return savedToken;
  }

  /** Deactivates a device token (e.g., when FCM reports invalid token). */
  async deactivateToken(fcmToken: string): Promise<void> {
    await this.deviceTokenRepository.update({ fcmToken }, { isActive: false });
  }

  /** Syncs a single token by ID using Firebase topic subscription. */
  async syncTokenById(params: { tokenId: string }): Promise<void> {
    const token = await this.deviceTokenRepository.findOne({ where: { id: params.tokenId } });
    if (!token) return;
    if (!token.isActive) return;
    await this.executeTokenTopicSync({ token });
  }

  /** Syncs pending tokens in batch. */
  async syncPendingTokens(): Promise<void> {
    const batchSize: number = this.getEnvNumber('DEVICE_TOKEN_TOPIC_SYNC_BATCH_SIZE', DEFAULT_TOPIC_SYNC_BATCH_SIZE);
    const retryDelayMinutes: number = this.getEnvNumber(
      'DEVICE_TOKEN_TOPIC_SYNC_RETRY_DELAY_MINUTES',
      DEFAULT_TOPIC_SYNC_RETRY_DELAY_MINUTES,
    );
    const maxRetries: number = this.getEnvNumber('DEVICE_TOKEN_TOPIC_SYNC_MAX_RETRIES', DEFAULT_TOPIC_SYNC_MAX_RETRIES);
    const tokens = await this.getTokensPendingSync({ batchSize, retryDelayMinutes, maxRetries });
    if (tokens.length === 0) return;
    await this.executeBatchTopicSync({ tokens });
  }

  private async ensureRepeatableSyncJob(): Promise<void> {
    const intervalMinutes: number = this.getEnvNumber(
      'DEVICE_TOKEN_TOPIC_SYNC_INTERVAL_MINUTES',
      DEFAULT_TOPIC_SYNC_INTERVAL_MINUTES,
    );
    const repeatEveryMs: number = intervalMinutes * 60 * 1000;
    const jobOptions = {
      repeat: { every: repeatEveryMs },
      jobId: DEVICE_TOKEN_QUEUE.JOB.SYNC_PENDING,
      removeOnComplete: true,
      removeOnFail: false,
    };
    await this.deviceTokenQueue.add(DEVICE_TOKEN_QUEUE.JOB.SYNC_PENDING, {}, jobOptions);
  }

  private async enqueueSyncToken(params: SyncTokenJobData): Promise<void> {
    const jobOptions = { jobId: `sync-token-${params.tokenId}`, removeOnComplete: true, removeOnFail: false };
    await this.deviceTokenQueue.add(DEVICE_TOKEN_QUEUE.JOB.SYNC_TOKEN, params, jobOptions);
  }

  private async executeTokenTopicSync(params: { token: DeviceToken }): Promise<void> {
    const topics: string[] = this.getTopicsForPlatform(params.token.platform);
    const outcome = await this.subscribeSingleTokenToTopics({ token: params.token, topics });
    await this.applySyncOutcome({ token: params.token, outcome });
  }

  private async executeBatchTopicSync(params: { tokens: DeviceToken[] }): Promise<void> {
    const outcomes = await this.subscribeTokensToTopicsInBatch({ tokens: params.tokens });
    for (const outcome of outcomes) {
      const token = params.tokens.find((item: DeviceToken) => item.id === outcome.tokenId);
      if (!token) continue;
      await this.applySyncOutcome({ token, outcome });
    }
  }

  private async subscribeSingleTokenToTopics(params: {
    token: DeviceToken;
    topics: string[];
  }): Promise<TokenSyncOutcome> {
    const outcomes: TokenSyncOutcome = {
      tokenId: params.token.id,
      topics: params.topics,
      errorMessage: null,
      errorCode: null,
    };
    try {
      const messagingClient = this.getMessagingClient();
      for (const topic of params.topics) {
        await messagingClient.subscribeToTopic([params.token.fcmToken], topic);
      }
      return outcomes;
    } catch (error) {
      const errorMessage: string = this.getErrorMessage(error);
      const errorCode: string | null = this.getErrorCode(error);
      return { ...outcomes, errorMessage, errorCode };
    }
  }

  private async subscribeTokensToTopicsInBatch(params: { tokens: DeviceToken[] }): Promise<TokenSyncOutcome[]> {
    const tokens: DeviceToken[] = params.tokens;
    const topics: string[] = [DEVICE_TOKEN_TOPICS.ALL, DEVICE_TOKEN_TOPICS.IOS, DEVICE_TOKEN_TOPICS.ANDROID];
    const topicTokenMap: Map<string, DeviceToken[]> = this.buildTopicTokenMap({ tokens });
    const resultsByTokenId: Map<string, TokenSyncOutcome> = new Map();
    for (const token of tokens) {
      resultsByTokenId.set(token.id, { tokenId: token.id, topics: [], errorMessage: null, errorCode: null });
    }
    for (const topic of topics) {
      const topicTokens = topicTokenMap.get(topic) ?? [];
      if (topicTokens.length === 0) continue;
      const subscriptionResult = await this.subscribeTokensToTopic({ tokens: topicTokens, topic });
      for (const token of topicTokens) {
        const result = resultsByTokenId.get(token.id);
        if (!result) continue;
        if (subscriptionResult.failedTokenIds.has(token.id)) {
          const errorMessage = subscriptionResult.errorByTokenId.get(token.id) ?? 'Unknown error';
          const errorCode = subscriptionResult.errorCodeByTokenId.get(token.id) ?? null;
          result.errorMessage = result.errorMessage ?? errorMessage;
          result.errorCode = result.errorCode ?? errorCode;
          continue;
        }
        result.topics.push(topic);
      }
    }
    return Array.from(resultsByTokenId.values());
  }

  private async subscribeTokensToTopic(params: {
    tokens: DeviceToken[];
    topic: string;
  }): Promise<TopicSubscriptionResult> {
    const result: TopicSubscriptionResult = {
      topic: params.topic,
      failedTokenIds: new Set<string>(),
      errorByTokenId: new Map<string, string>(),
      errorCodeByTokenId: new Map<string, string>(),
    };
    const tokenChunks: DeviceToken[][] = this.chunkTokens({
      tokens: params.tokens,
      chunkSize: MAX_TOPIC_SUBSCRIBE_BATCH_SIZE,
    });
    const messagingClient = this.getMessagingClient();
    for (const chunk of tokenChunks) {
      const tokenValues: string[] = chunk.map((token: DeviceToken) => token.fcmToken);
      try {
        const response = await messagingClient.subscribeToTopic(tokenValues, params.topic);
        for (const errorItem of response.errors) {
          const failedToken = chunk[errorItem.index];
          if (!failedToken) continue;
          result.failedTokenIds.add(failedToken.id);
          result.errorByTokenId.set(failedToken.id, errorItem.error.message);
          result.errorCodeByTokenId.set(failedToken.id, errorItem.error.code);
        }
      } catch (error) {
        const errorMessage: string = this.getErrorMessage(error);
        const errorCode: string | null = this.getErrorCode(error);
        for (const failedToken of chunk) {
          result.failedTokenIds.add(failedToken.id);
          result.errorByTokenId.set(failedToken.id, errorMessage);
          if (errorCode) result.errorCodeByTokenId.set(failedToken.id, errorCode);
        }
      }
    }
    return result;
  }

  private async applySyncOutcome(params: { token: DeviceToken; outcome: TokenSyncOutcome }): Promise<void> {
    const attemptedAt: Date = new Date();
    if (!params.outcome.errorMessage) {
      await this.deviceTokenRepository.update(
        { id: params.token.id },
        {
          topicsSyncStatus: TopicSyncStatus.SYNCED,
          topicsSyncedList: params.outcome.topics,
          topicsSyncAttemptedAt: attemptedAt,
          topicsSyncRetryCount: 0,
          topicsSyncError: null,
        },
      );
      return;
    }
    if (this.isInvalidTokenError(params.outcome.errorCode)) {
      await this.deviceTokenRepository.update(
        { id: params.token.id },
        {
          isActive: false,
          topicsSyncStatus: TopicSyncStatus.FAILED,
          topicsSyncAttemptedAt: attemptedAt,
          topicsSyncRetryCount: params.token.topicsSyncRetryCount + 1,
          topicsSyncError: params.outcome.errorMessage,
        },
      );
      return;
    }
    await this.deviceTokenRepository.update(
      { id: params.token.id },
      {
        topicsSyncStatus: TopicSyncStatus.FAILED,
        topicsSyncAttemptedAt: attemptedAt,
        topicsSyncRetryCount: params.token.topicsSyncRetryCount + 1,
        topicsSyncError: params.outcome.errorMessage,
      },
    );
  }

  private buildTopicTokenMap(params: { tokens: DeviceToken[] }): Map<string, DeviceToken[]> {
    const map = new Map<string, DeviceToken[]>();
    map.set(DEVICE_TOKEN_TOPICS.ALL, [...params.tokens]);
    map.set(
      DEVICE_TOKEN_TOPICS.IOS,
      params.tokens.filter((token: DeviceToken) => token.platform === Platform.IOS),
    );
    map.set(
      DEVICE_TOKEN_TOPICS.ANDROID,
      params.tokens.filter((token: DeviceToken) => token.platform === Platform.ANDROID),
    );
    return map;
  }

  private getTopicsForPlatform(platform: Platform): string[] {
    if (platform === Platform.ANDROID) return [DEVICE_TOKEN_TOPICS.ALL, DEVICE_TOKEN_TOPICS.ANDROID];
    return [DEVICE_TOKEN_TOPICS.ALL, DEVICE_TOKEN_TOPICS.IOS];
  }

  private async getTokensPendingSync(params: {
    batchSize: number;
    retryDelayMinutes: number;
    maxRetries: number;
  }): Promise<DeviceToken[]> {
    const retryBefore: Date = new Date(Date.now() - params.retryDelayMinutes * 60 * 1000);
    const statuses = In([TopicSyncStatus.PENDING, TopicSyncStatus.FAILED]);
    return this.deviceTokenRepository.find({
      where: [
        {
          isActive: true,
          topicsSyncStatus: statuses,
          topicsSyncRetryCount: LessThan(params.maxRetries),
          topicsSyncAttemptedAt: IsNull(),
        },
        {
          isActive: true,
          topicsSyncStatus: statuses,
          topicsSyncRetryCount: LessThan(params.maxRetries),
          topicsSyncAttemptedAt: LessThanOrEqual(retryBefore),
        },
      ],
      take: params.batchSize,
      order: { topicsSyncAttemptedAt: 'ASC' },
    });
  }

  private chunkTokens(params: { tokens: DeviceToken[]; chunkSize: number }): DeviceToken[][] {
    const chunks: DeviceToken[][] = [];
    for (let i = 0; i < params.tokens.length; i += params.chunkSize) {
      chunks.push(params.tokens.slice(i, i + params.chunkSize));
    }
    return chunks;
  }

  private getMessagingClient(): admin.messaging.Messaging {
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      } catch (error) {
        const errorMessage: string = this.getErrorMessage(error);
        this.logger.warn(`Firebase Admin initialization failed: ${errorMessage}`);
        throw error;
      }
    }
    return admin.messaging();
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return 'Unknown error';
  }

  private getErrorCode(error: unknown): string | null {
    if (error && typeof error === 'object' && 'code' in error) {
      const code = (error as { code?: unknown }).code;
      if (typeof code === 'string') return code;
    }
    return null;
  }

  private isInvalidTokenError(errorCode: string | null): boolean {
    if (!errorCode) return false;
    const invalidCodes: string[] = [
      'messaging/invalid-registration-token',
      'messaging/registration-token-not-registered',
      'messaging/invalid-argument',
    ];
    return invalidCodes.includes(errorCode);
  }

  private getEnvNumber(key: string, fallback: number): number {
    const rawValue: string | undefined = process.env[key];
    if (!rawValue) return fallback;
    const parsedValue: number = Number(rawValue);
    if (Number.isNaN(parsedValue)) return fallback;
    return parsedValue;
  }
}
