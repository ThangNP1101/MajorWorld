import { PushMessageService } from './push-message.service';
import { PushMessage } from './entities/push-message.entity';
import { CreatePushMessageDto } from './dto/create-push-message.dto';
import { UpdatePushMessageDto } from './dto/update-push-message.dto';
import { SendTestPushDto } from './dto/send-test-push.dto';
import { DeviceStatsDto } from './dto/device-stats.dto';
import { UploadService } from '../upload/upload.service';
export declare class PushMessageController {
    private readonly pushMessageService;
    private readonly uploadService;
    constructor(pushMessageService: PushMessageService, uploadService: UploadService);
    findAll(): Promise<PushMessage[]>;
    findScheduled(): Promise<PushMessage[]>;
    getDeviceStats(): Promise<DeviceStatsDto>;
    findOne(id: number): Promise<PushMessage>;
    create(createDto: CreatePushMessageDto): Promise<PushMessage>;
    update(id: number, updateDto: UpdatePushMessageDto): Promise<PushMessage>;
    remove(id: number): Promise<void>;
    send(id: number): Promise<PushMessage>;
    sendTest(id: number, sendTestDto: SendTestPushDto): Promise<void>;
    uploadImage(id: number, file: Express.Multer.File): Promise<PushMessage>;
}
