import { PushMessage } from '../../push-message/entities/push-message.entity';
import { DeviceToken } from '../../device-token/entities/device-token.entity';
export declare enum EventType {
    SENT = "sent",
    DELIVERED = "delivered",
    OPENED = "opened",
    CLICKED = "clicked"
}
export declare class PushStatistics {
    id: number;
    pushMessageId: number;
    deviceTokenId: string;
    eventType: EventType;
    createdAt: Date;
    pushMessage: PushMessage;
    deviceToken: DeviceToken;
}
