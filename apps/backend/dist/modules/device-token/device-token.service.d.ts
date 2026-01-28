import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { DeviceToken } from './entities/device-token.entity';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
interface SyncTokenJobData {
    tokenId: string;
}
interface SyncPendingJobData {
}
type DeviceTokenQueueData = SyncTokenJobData | SyncPendingJobData;
export declare class DeviceTokenService implements OnModuleInit {
    private deviceTokenRepository;
    private deviceTokenQueue;
    private readonly logger;
    constructor(deviceTokenRepository: Repository<DeviceToken>, deviceTokenQueue: Queue<DeviceTokenQueueData>);
    onModuleInit(): Promise<void>;
    findAll(): Promise<DeviceToken[]>;
    findOne(id: string): Promise<DeviceToken>;
    create(createDto: CreateDeviceTokenDto): Promise<DeviceToken>;
    remove(id: string): Promise<void>;
    registerToken(registerDto: RegisterDeviceTokenDto): Promise<DeviceToken>;
    deactivateToken(fcmToken: string): Promise<void>;
    syncTokenById(params: {
        tokenId: string;
    }): Promise<void>;
    syncPendingTokens(): Promise<void>;
    private ensureRepeatableSyncJob;
    private enqueueSyncToken;
    private executeTokenTopicSync;
    private executeBatchTopicSync;
    private subscribeSingleTokenToTopics;
    private subscribeTokensToTopicsInBatch;
    private subscribeTokensToTopic;
    private applySyncOutcome;
    private buildTopicTokenMap;
    private getTopicsForPlatform;
    private getTokensPendingSync;
    private chunkTokens;
    private getMessagingClient;
    private getErrorMessage;
    private getErrorCode;
    private isInvalidTokenError;
    private getEnvNumber;
}
export {};
