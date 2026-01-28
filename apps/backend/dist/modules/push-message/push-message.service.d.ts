import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { PushMessage } from './entities/push-message.entity';
import { CreatePushMessageDto } from './dto/create-push-message.dto';
import { UpdatePushMessageDto } from './dto/update-push-message.dto';
import { DeviceToken } from '../device-token/entities/device-token.entity';
import { TestDeviceToken } from '../test-device-token/entities/test-device-token.entity';
import { DeviceStatsDto } from './dto/device-stats.dto';
interface ScheduledPushJobData {
    messageId: number;
}
export declare class PushMessageService {
    private pushMessageRepository;
    private deviceTokenRepository;
    private testDeviceTokenRepository;
    private scheduledQueue;
    constructor(pushMessageRepository: Repository<PushMessage>, deviceTokenRepository: Repository<DeviceToken>, testDeviceTokenRepository: Repository<TestDeviceToken>, scheduledQueue: Queue<ScheduledPushJobData>);
    findAll(): Promise<PushMessage[]>;
    findScheduled(): Promise<PushMessage[]>;
    findOne(id: number): Promise<PushMessage>;
    create(createDto: CreatePushMessageDto): Promise<PushMessage>;
    update(id: number, updateDto: UpdatePushMessageDto): Promise<PushMessage>;
    remove(id: number): Promise<void>;
    getDeviceStats(): Promise<DeviceStatsDto>;
    send(id: number): Promise<PushMessage>;
    sendTest(id: number, deviceTokenIds: string[]): Promise<void>;
    executeSendScheduledMessage(params: {
        messageId: number;
    }): Promise<void>;
    private countTargetDeviceTokens;
    private sendPushNotificationsByTopic;
    private sendTestPushNotifications;
    private buildMessageData;
    private buildAndroidTopicMessage;
    private buildIosTopicMessage;
    private buildAllTopicMessage;
    private buildAndroidTokenMessage;
    private buildIosTokenMessage;
    private buildAndroidConfig;
    private buildApnsConfig;
    private getMessagingClient;
    processScheduledMessages(): Promise<void>;
    private executeUpdateScheduledJob;
    private executeSchedulePushMessageJob;
    private executeCancelScheduledJob;
    private buildScheduledJobId;
    private isScheduledAtChanged;
}
export {};
