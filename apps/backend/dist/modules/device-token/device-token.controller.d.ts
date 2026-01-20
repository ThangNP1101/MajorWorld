import { DeviceTokenService } from './device-token.service';
import { DeviceToken } from './entities/device-token.entity';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';
export declare class DeviceTokenController {
    private readonly deviceTokenService;
    constructor(deviceTokenService: DeviceTokenService);
    findAll(): Promise<DeviceToken[]>;
    findOne(id: string): Promise<DeviceToken>;
    create(createDto: CreateDeviceTokenDto): Promise<DeviceToken>;
    remove(id: string): Promise<void>;
}
