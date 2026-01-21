import { Platform } from '../../device-token/entities/device-token.entity';
export declare class CreateTestDeviceTokenDto {
    userId?: number;
    fcmToken: string;
    platform: Platform;
    appVersion?: string;
    isActive?: boolean;
    lastSeenAt?: string;
}
