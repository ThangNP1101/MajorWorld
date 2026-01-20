import { PushTarget, SendType } from '../entities/push-message.entity';
export declare class CreatePushMessageDto {
    title: string;
    androidMessage?: string;
    androidBigtext?: string;
    iosMessage?: string;
    imageUrl?: string;
    landingUrl?: string;
    target: PushTarget;
    sendType: SendType;
    scheduledAt?: string;
}
