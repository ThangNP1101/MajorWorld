import { Repository } from 'typeorm';
import { TestDeviceToken } from './entities/test-device-token.entity';
import { CreateTestDeviceTokenDto } from './dto/create-test-device-token.dto';
export declare class TestDeviceTokenService {
    private testDeviceTokenRepository;
    constructor(testDeviceTokenRepository: Repository<TestDeviceToken>);
    findAll(): Promise<TestDeviceToken[]>;
    findOne(id: string): Promise<TestDeviceToken>;
    create(createDto: CreateTestDeviceTokenDto): Promise<TestDeviceToken>;
    remove(id: string): Promise<void>;
}
