import { TopicSyncStatus } from '../enums/topic-sync-status.enum';
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
    topicsSyncStatus: TopicSyncStatus;
    topicsSyncedList: string[];
    topicsSyncAttemptedAt: Date;
    topicsSyncRetryCount: number;
    topicsSyncError: string;
    lastSeenAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
