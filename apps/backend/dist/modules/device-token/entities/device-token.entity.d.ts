export declare enum Platform {
    ANDROID = "android",
    IOS = "ios"
}
export declare class DeviceToken {
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
