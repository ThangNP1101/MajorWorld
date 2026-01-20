import { Platform } from '../entities/device-token.entity';
export declare class CreateDeviceTokenDto {
    userId?: number;
    fcmToken: string;
    platform: Platform;
    appVersion?: string;
    isActive?: boolean;
    lastSeenAt?: string;
}
