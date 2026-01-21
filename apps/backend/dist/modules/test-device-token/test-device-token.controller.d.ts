import { TestDeviceTokenService } from './test-device-token.service';
import { TestDeviceToken } from './entities/test-device-token.entity';
import { CreateTestDeviceTokenDto } from './dto/create-test-device-token.dto';
export declare class TestDeviceTokenController {
    private readonly testDeviceTokenService;
    constructor(testDeviceTokenService: TestDeviceTokenService);
    findAll(): Promise<TestDeviceToken[]>;
    findOne(id: string): Promise<TestDeviceToken>;
    create(createDto: CreateTestDeviceTokenDto): Promise<TestDeviceToken>;
    remove(id: string): Promise<void>;
}
