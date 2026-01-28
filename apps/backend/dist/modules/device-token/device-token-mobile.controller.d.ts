import { DeviceTokenService } from './device-token.service';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
import { RegisterDeviceTokenResponseDto } from './dto/register-device-token-response.dto';
export declare class DeviceTokenMobileController {
    private readonly deviceTokenService;
    constructor(deviceTokenService: DeviceTokenService);
    registerToken(registerDto: RegisterDeviceTokenDto): Promise<RegisterDeviceTokenResponseDto>;
}
