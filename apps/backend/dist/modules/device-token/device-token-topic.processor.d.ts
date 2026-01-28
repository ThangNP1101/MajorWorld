import { Job } from 'bull';
import { DeviceTokenService } from './device-token.service';
interface SyncTokenJobData {
    tokenId: string;
}
interface SyncPendingJobData {
}
export declare class DeviceTokenTopicProcessor {
    private readonly deviceTokenService;
    private readonly logger;
    constructor(deviceTokenService: DeviceTokenService);
    handleSyncToken(job: Job<SyncTokenJobData>): Promise<void>;
    handleSyncPending(job: Job<SyncPendingJobData>): Promise<void>;
}
export {};
