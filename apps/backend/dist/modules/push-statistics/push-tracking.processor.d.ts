import { Repository } from 'typeorm';
import { Job } from 'bull';
import { PushStatistics, EventType } from './entities/push-statistics.entity';
import { PushMessage } from '../push-message/entities/push-message.entity';
export interface TrackingJobData {
    pushMessageId: number;
    deviceTokenId: string;
    eventType: EventType;
    timestamp: number;
}
export declare const PUSH_TRACKING_QUEUE = "push-tracking";
export declare class PushTrackingProcessor {
    private statsRepo;
    private messageRepo;
    private readonly logger;
    constructor(statsRepo: Repository<PushStatistics>, messageRepo: Repository<PushMessage>);
    handleTrack(job: Job<TrackingJobData>): Promise<void>;
    handleBatchTrack(job: Job<{
        events: TrackingJobData[];
    }>): Promise<void>;
    onFailed(job: Job, error: Error): void;
}
