import { PushStatisticsService } from './push-statistics.service';
import { TrackEventDto } from './dto/track-event.dto';
import { GetStatsQueryDto, PaginationDto } from './dto/get-stats-query.dto';
import { StatsSummaryDto, MessageHistoryItemDto } from './dto/stats-summary.dto';
export declare class PushStatisticsController {
    private readonly pushStatisticsService;
    constructor(pushStatisticsService: PushStatisticsService);
    trackDelivered(dto: TrackEventDto): Promise<{
        success: boolean;
        queued?: boolean;
        duplicate?: boolean;
    }>;
    trackOpened(dto: TrackEventDto): Promise<{
        success: boolean;
        queued?: boolean;
        duplicate?: boolean;
    }>;
    trackClicked(dto: TrackEventDto): Promise<{
        success: boolean;
        queued?: boolean;
        duplicate?: boolean;
    }>;
    getSummary(dto: GetStatsQueryDto): Promise<StatsSummaryDto>;
    getHistory(dto: PaginationDto): Promise<{
        items: MessageHistoryItemDto[];
        total: number;
    }>;
    getMessageStats(id: number): Promise<{
        delivered: number;
        opened: number;
        clicked: number;
        deliveryRate: string;
        openRate: string;
        clickRate: string;
    }>;
}
