import { Repository } from 'typeorm';
import { PushMessage } from './entities/push-message.entity';
import { CreatePushMessageDto } from './dto/create-push-message.dto';
import { UpdatePushMessageDto } from './dto/update-push-message.dto';
import { DeviceToken } from '../device-token/entities/device-token.entity';
import { TestDeviceToken } from '../test-device-token/entities/test-device-token.entity';
import { DeviceStatsDto } from './dto/device-stats.dto';
export declare class PushMessageService {
    private pushMessageRepository;
    private deviceTokenRepository;
    private testDeviceTokenRepository;
    constructor(pushMessageRepository: Repository<PushMessage>, deviceTokenRepository: Repository<DeviceToken>, testDeviceTokenRepository: Repository<TestDeviceToken>);
    findAll(): Promise<PushMessage[]>;
    findScheduled(): Promise<PushMessage[]>;
    findOne(id: number): Promise<PushMessage>;
    create(createDto: CreatePushMessageDto): Promise<PushMessage>;
    update(id: number, updateDto: UpdatePushMessageDto): Promise<PushMessage>;
    remove(id: number): Promise<void>;
    getDeviceStats(): Promise<DeviceStatsDto>;
    send(id: number): Promise<PushMessage>;
    sendTest(id: number, deviceTokenIds: string[]): Promise<void>;
    private getTargetDeviceTokens;
    private sendPushNotifications;
    processScheduledMessages(): Promise<void>;
    private getTestDeviceTokensFromEnv;
}
