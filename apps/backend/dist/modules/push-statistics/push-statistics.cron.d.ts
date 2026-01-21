import { PushStatisticsService } from './push-statistics.service';
export declare class PushStatisticsCron {
    private readonly pushStatisticsService;
    private readonly logger;
    constructor(pushStatisticsService: PushStatisticsService);
    syncRedisToDatabase(): Promise<void>;
}
