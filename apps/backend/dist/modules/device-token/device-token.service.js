"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DeviceTokenService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTokenService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const admin = require("firebase-admin");
const device_token_entity_1 = require("./entities/device-token.entity");
const topic_sync_status_enum_1 = require("./enums/topic-sync-status.enum");
const device_token_topics_constants_1 = require("./constants/device-token-topics.constants");
const device_token_queue_constants_1 = require("./constants/device-token-queue.constants");
const DEFAULT_TOPIC_SYNC_INTERVAL_MINUTES = 5;
const DEFAULT_TOPIC_SYNC_BATCH_SIZE = 500;
const DEFAULT_TOPIC_SYNC_MAX_RETRIES = 5;
const DEFAULT_TOPIC_SYNC_RETRY_DELAY_MINUTES = 10;
const MAX_TOPIC_SUBSCRIBE_BATCH_SIZE = 1000;
let DeviceTokenService = DeviceTokenService_1 = class DeviceTokenService {
    constructor(deviceTokenRepository, deviceTokenQueue) {
        this.deviceTokenRepository = deviceTokenRepository;
        this.deviceTokenQueue = deviceTokenQueue;
        this.logger = new common_1.Logger(DeviceTokenService_1.name);
    }
    async onModuleInit() {
        await this.ensureRepeatableSyncJob();
    }
    async findAll() {
        return this.deviceTokenRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const token = await this.deviceTokenRepository.findOne({ where: { id } });
        if (!token) {
            throw new common_1.NotFoundException(`Device token with ID ${id} not found`);
        }
        return token;
    }
    async create(createDto) {
        const token = this.deviceTokenRepository.create({
            userId: createDto.userId ?? null,
            fcmToken: createDto.fcmToken,
            platform: createDto.platform,
            appVersion: createDto.appVersion ?? null,
            isActive: createDto.isActive ?? true,
            lastSeenAt: createDto.lastSeenAt ? new Date(createDto.lastSeenAt) : null,
            topicsSyncStatus: topic_sync_status_enum_1.TopicSyncStatus.PENDING,
            topicsSyncedList: [],
            topicsSyncAttemptedAt: null,
            topicsSyncRetryCount: 0,
            topicsSyncError: null,
        });
        try {
            const savedToken = await this.deviceTokenRepository.save(token);
            void this.enqueueSyncToken({ tokenId: savedToken.id });
            return savedToken;
        }
        catch (error) {
            const errorCode = this.getErrorCode(error);
            if (errorCode === '23505') {
                throw new common_1.BadRequestException('FCM token already exists');
            }
            throw error;
        }
    }
    async remove(id) {
        const token = await this.findOne(id);
        await this.deviceTokenRepository.remove(token);
    }
    async registerToken(registerDto) {
        const existingToken = await this.deviceTokenRepository.findOne({
            where: { fcmToken: registerDto.fcmToken },
        });
        if (existingToken) {
            existingToken.platform = registerDto.platform;
            existingToken.appVersion = registerDto.appVersion ?? existingToken.appVersion;
            existingToken.isActive = true;
            existingToken.lastSeenAt = new Date();
            existingToken.topicsSyncStatus = topic_sync_status_enum_1.TopicSyncStatus.PENDING;
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
            topicsSyncStatus: topic_sync_status_enum_1.TopicSyncStatus.PENDING,
            topicsSyncedList: [],
            topicsSyncAttemptedAt: null,
            topicsSyncRetryCount: 0,
            topicsSyncError: null,
        });
        const savedToken = await this.deviceTokenRepository.save(newToken);
        void this.enqueueSyncToken({ tokenId: savedToken.id });
        return savedToken;
    }
    async deactivateToken(fcmToken) {
        await this.deviceTokenRepository.update({ fcmToken }, { isActive: false });
    }
    async syncTokenById(params) {
        const token = await this.deviceTokenRepository.findOne({ where: { id: params.tokenId } });
        if (!token)
            return;
        if (!token.isActive)
            return;
        await this.executeTokenTopicSync({ token });
    }
    async syncPendingTokens() {
        const batchSize = this.getEnvNumber('DEVICE_TOKEN_TOPIC_SYNC_BATCH_SIZE', DEFAULT_TOPIC_SYNC_BATCH_SIZE);
        const retryDelayMinutes = this.getEnvNumber('DEVICE_TOKEN_TOPIC_SYNC_RETRY_DELAY_MINUTES', DEFAULT_TOPIC_SYNC_RETRY_DELAY_MINUTES);
        const maxRetries = this.getEnvNumber('DEVICE_TOKEN_TOPIC_SYNC_MAX_RETRIES', DEFAULT_TOPIC_SYNC_MAX_RETRIES);
        const tokens = await this.getTokensPendingSync({ batchSize, retryDelayMinutes, maxRetries });
        if (tokens.length === 0)
            return;
        await this.executeBatchTopicSync({ tokens });
    }
    async ensureRepeatableSyncJob() {
        const intervalMinutes = this.getEnvNumber('DEVICE_TOKEN_TOPIC_SYNC_INTERVAL_MINUTES', DEFAULT_TOPIC_SYNC_INTERVAL_MINUTES);
        const repeatEveryMs = intervalMinutes * 60 * 1000;
        const jobOptions = {
            repeat: { every: repeatEveryMs },
            jobId: device_token_queue_constants_1.DEVICE_TOKEN_QUEUE.JOB.SYNC_PENDING,
            removeOnComplete: true,
            removeOnFail: false,
        };
        await this.deviceTokenQueue.add(device_token_queue_constants_1.DEVICE_TOKEN_QUEUE.JOB.SYNC_PENDING, {}, jobOptions);
    }
    async enqueueSyncToken(params) {
        const jobOptions = { jobId: `sync-token-${params.tokenId}`, removeOnComplete: true, removeOnFail: false };
        await this.deviceTokenQueue.add(device_token_queue_constants_1.DEVICE_TOKEN_QUEUE.JOB.SYNC_TOKEN, params, jobOptions);
    }
    async executeTokenTopicSync(params) {
        const topics = this.getTopicsForPlatform(params.token.platform);
        const outcome = await this.subscribeSingleTokenToTopics({ token: params.token, topics });
        await this.applySyncOutcome({ token: params.token, outcome });
    }
    async executeBatchTopicSync(params) {
        const outcomes = await this.subscribeTokensToTopicsInBatch({ tokens: params.tokens });
        for (const outcome of outcomes) {
            const token = params.tokens.find((item) => item.id === outcome.tokenId);
            if (!token)
                continue;
            await this.applySyncOutcome({ token, outcome });
        }
    }
    async subscribeSingleTokenToTopics(params) {
        const outcomes = {
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
        }
        catch (error) {
            const errorMessage = this.getErrorMessage(error);
            const errorCode = this.getErrorCode(error);
            return { ...outcomes, errorMessage, errorCode };
        }
    }
    async subscribeTokensToTopicsInBatch(params) {
        const tokens = params.tokens;
        const topics = [device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.ALL, device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.IOS, device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.ANDROID];
        const topicTokenMap = this.buildTopicTokenMap({ tokens });
        const resultsByTokenId = new Map();
        for (const token of tokens) {
            resultsByTokenId.set(token.id, { tokenId: token.id, topics: [], errorMessage: null, errorCode: null });
        }
        for (const topic of topics) {
            const topicTokens = topicTokenMap.get(topic) ?? [];
            if (topicTokens.length === 0)
                continue;
            const subscriptionResult = await this.subscribeTokensToTopic({ tokens: topicTokens, topic });
            for (const token of topicTokens) {
                const result = resultsByTokenId.get(token.id);
                if (!result)
                    continue;
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
    async subscribeTokensToTopic(params) {
        const result = {
            topic: params.topic,
            failedTokenIds: new Set(),
            errorByTokenId: new Map(),
            errorCodeByTokenId: new Map(),
        };
        const tokenChunks = this.chunkTokens({
            tokens: params.tokens,
            chunkSize: MAX_TOPIC_SUBSCRIBE_BATCH_SIZE,
        });
        const messagingClient = this.getMessagingClient();
        for (const chunk of tokenChunks) {
            const tokenValues = chunk.map((token) => token.fcmToken);
            try {
                const response = await messagingClient.subscribeToTopic(tokenValues, params.topic);
                for (const errorItem of response.errors) {
                    const failedToken = chunk[errorItem.index];
                    if (!failedToken)
                        continue;
                    result.failedTokenIds.add(failedToken.id);
                    result.errorByTokenId.set(failedToken.id, errorItem.error.message);
                    result.errorCodeByTokenId.set(failedToken.id, errorItem.error.code);
                }
            }
            catch (error) {
                const errorMessage = this.getErrorMessage(error);
                const errorCode = this.getErrorCode(error);
                for (const failedToken of chunk) {
                    result.failedTokenIds.add(failedToken.id);
                    result.errorByTokenId.set(failedToken.id, errorMessage);
                    if (errorCode)
                        result.errorCodeByTokenId.set(failedToken.id, errorCode);
                }
            }
        }
        return result;
    }
    async applySyncOutcome(params) {
        const attemptedAt = new Date();
        if (!params.outcome.errorMessage) {
            await this.deviceTokenRepository.update({ id: params.token.id }, {
                topicsSyncStatus: topic_sync_status_enum_1.TopicSyncStatus.SYNCED,
                topicsSyncedList: params.outcome.topics,
                topicsSyncAttemptedAt: attemptedAt,
                topicsSyncRetryCount: 0,
                topicsSyncError: null,
            });
            return;
        }
        if (this.isInvalidTokenError(params.outcome.errorCode)) {
            await this.deviceTokenRepository.update({ id: params.token.id }, {
                isActive: false,
                topicsSyncStatus: topic_sync_status_enum_1.TopicSyncStatus.FAILED,
                topicsSyncAttemptedAt: attemptedAt,
                topicsSyncRetryCount: params.token.topicsSyncRetryCount + 1,
                topicsSyncError: params.outcome.errorMessage,
            });
            return;
        }
        await this.deviceTokenRepository.update({ id: params.token.id }, {
            topicsSyncStatus: topic_sync_status_enum_1.TopicSyncStatus.FAILED,
            topicsSyncAttemptedAt: attemptedAt,
            topicsSyncRetryCount: params.token.topicsSyncRetryCount + 1,
            topicsSyncError: params.outcome.errorMessage,
        });
    }
    buildTopicTokenMap(params) {
        const map = new Map();
        map.set(device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.ALL, [...params.tokens]);
        map.set(device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.IOS, params.tokens.filter((token) => token.platform === device_token_entity_1.Platform.IOS));
        map.set(device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.ANDROID, params.tokens.filter((token) => token.platform === device_token_entity_1.Platform.ANDROID));
        return map;
    }
    getTopicsForPlatform(platform) {
        if (platform === device_token_entity_1.Platform.ANDROID)
            return [device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.ALL, device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.ANDROID];
        return [device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.ALL, device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.IOS];
    }
    async getTokensPendingSync(params) {
        const retryBefore = new Date(Date.now() - params.retryDelayMinutes * 60 * 1000);
        const statuses = (0, typeorm_2.In)([topic_sync_status_enum_1.TopicSyncStatus.PENDING, topic_sync_status_enum_1.TopicSyncStatus.FAILED]);
        return this.deviceTokenRepository.find({
            where: [
                {
                    isActive: true,
                    topicsSyncStatus: statuses,
                    topicsSyncRetryCount: (0, typeorm_2.LessThan)(params.maxRetries),
                    topicsSyncAttemptedAt: (0, typeorm_2.IsNull)(),
                },
                {
                    isActive: true,
                    topicsSyncStatus: statuses,
                    topicsSyncRetryCount: (0, typeorm_2.LessThan)(params.maxRetries),
                    topicsSyncAttemptedAt: (0, typeorm_2.LessThanOrEqual)(retryBefore),
                },
            ],
            take: params.batchSize,
            order: { topicsSyncAttemptedAt: 'ASC' },
        });
    }
    chunkTokens(params) {
        const chunks = [];
        for (let i = 0; i < params.tokens.length; i += params.chunkSize) {
            chunks.push(params.tokens.slice(i, i + params.chunkSize));
        }
        return chunks;
    }
    getMessagingClient() {
        if (!admin.apps.length) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    }),
                });
            }
            catch (error) {
                const errorMessage = this.getErrorMessage(error);
                this.logger.warn(`Firebase Admin initialization failed: ${errorMessage}`);
                throw error;
            }
        }
        return admin.messaging();
    }
    getErrorMessage(error) {
        if (error instanceof Error)
            return error.message;
        return 'Unknown error';
    }
    getErrorCode(error) {
        if (error && typeof error === 'object' && 'code' in error) {
            const code = error.code;
            if (typeof code === 'string')
                return code;
        }
        return null;
    }
    isInvalidTokenError(errorCode) {
        if (!errorCode)
            return false;
        const invalidCodes = [
            'messaging/invalid-registration-token',
            'messaging/registration-token-not-registered',
            'messaging/invalid-argument',
        ];
        return invalidCodes.includes(errorCode);
    }
    getEnvNumber(key, fallback) {
        const rawValue = process.env[key];
        if (!rawValue)
            return fallback;
        const parsedValue = Number(rawValue);
        if (Number.isNaN(parsedValue))
            return fallback;
        return parsedValue;
    }
};
exports.DeviceTokenService = DeviceTokenService;
exports.DeviceTokenService = DeviceTokenService = DeviceTokenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(device_token_entity_1.DeviceToken)),
    __param(1, (0, bull_1.InjectQueue)(device_token_queue_constants_1.DEVICE_TOKEN_QUEUE.QUEUE_NAME)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], DeviceTokenService);
//# sourceMappingURL=device-token.service.js.map