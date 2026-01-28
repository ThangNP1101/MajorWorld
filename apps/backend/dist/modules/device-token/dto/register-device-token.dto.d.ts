import { Platform } from '../entities/device-token.entity';
export declare class RegisterDeviceTokenDto {
    fcmToken: string;
    platform: Platform;
    appVersion?: string;
}
