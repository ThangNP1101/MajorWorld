import { Job } from 'bull';
import { PushMessageService } from './push-message.service';
interface ScheduledPushJobData {
    messageId: number;
}
export declare class PushScheduledProcessor {
    private readonly pushMessageService;
    private readonly logger;
    constructor(pushMessageService: PushMessageService);
    executeScheduledSend(job: Job<ScheduledPushJobData>): Promise<void>;
}
export {};
