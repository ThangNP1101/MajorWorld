import { Repository } from 'typeorm';
import { DeviceToken } from './entities/device-token.entity';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';
export declare class DeviceTokenService {
    private deviceTokenRepository;
    constructor(deviceTokenRepository: Repository<DeviceToken>);
    findAll(): Promise<DeviceToken[]>;
    findOne(id: string): Promise<DeviceToken>;
    create(createDto: CreateDeviceTokenDto): Promise<DeviceToken>;
    remove(id: string): Promise<void>;
}
