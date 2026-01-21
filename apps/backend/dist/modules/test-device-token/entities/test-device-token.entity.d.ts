import { Platform } from '../../device-token/entities/device-token.entity';
export declare class TestDeviceToken {
    id: string;
    userId: number;
    fcmToken: string;
    platform: Platform;
    appVersion: string;
    isActive: boolean;
    lastSeenAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
