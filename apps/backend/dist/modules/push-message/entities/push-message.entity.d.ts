export declare enum PushTarget {
    ALL = "all",
    ANDROID = "android",
    IOS = "ios"
}
export declare enum PushStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    SENDING = "sending",
    SENT = "sent"
}
export declare enum SendType {
    IMMEDIATE = "immediate",
    SCHEDULED = "scheduled"
}
export declare class PushMessage {
    id: number;
    title: string;
    androidMessage: string;
    androidBigtext: string;
    iosMessage: string;
    imageUrl: string;
    landingUrl: string;
    target: PushTarget;
    status: PushStatus;
    sendType: SendType;
    scheduledAt: Date;
    sentAt: Date;
    totalSent: number;
    totalViews: number;
    createdAt: Date;
    updatedAt: Date;
}
