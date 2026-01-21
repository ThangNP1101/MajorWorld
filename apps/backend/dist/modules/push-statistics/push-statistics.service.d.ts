import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { Redis } from 'ioredis';
import { PushStatistics, EventType } from './entities/push-statistics.entity';
import { PushMessage } from '../push-message/entities/push-message.entity';
import { TrackEventDto } from './dto/track-event.dto';
import { GetStatsQueryDto, PaginationDto } from './dto/get-stats-query.dto';
import { StatsSummaryDto, MessageHistoryItemDto } from './dto/stats-summary.dto';
import { TrackingJobData } from './push-tracking.processor';
export declare class PushStatisticsService {
    private statsRepo;
    private messageRepo;
    private trackingQueue;
    private redis;
    private readonly logger;
    constructor(statsRepo: Repository<PushStatistics>, messageRepo: Repository<PushMessage>, trackingQueue: Queue<TrackingJobData>, redis: Redis);
    trackEvent(dto: TrackEventDto, eventType: EventType): Promise<{
        success: boolean;
        queued?: boolean;
        duplicate?: boolean;
    }>;
    getSummary(dto: GetStatsQueryDto): Promise<StatsSummaryDto>;
    private calculatePeriodStats;
    private calculateChange;
    getMessageHistory(dto: PaginationDto): Promise<{
        items: MessageHistoryItemDto[];
        total: number;
    }>;
    getMessageStats(messageId: number): Promise<{
        delivered: number;
        opened: number;
        clicked: number;
        deliveryRate: string;
        openRate: string;
        clickRate: string;
    }>;
    syncRedisToDatabase(): Promise<void>;
}
