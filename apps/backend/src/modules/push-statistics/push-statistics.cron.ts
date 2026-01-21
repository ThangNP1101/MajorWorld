import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PushStatisticsService } from './push-statistics.service';

@Injectable()
export class PushStatisticsCron {
  private readonly logger = new Logger(PushStatisticsCron.name);

  constructor(private readonly pushStatisticsService: PushStatisticsService) {}

  /**
   * Sync Redis counters to PostgreSQL every 5 minutes
   * This ensures data persistence and keeps the database up to date
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncRedisToDatabase(): Promise<void> {
    this.logger.log('Running scheduled Redis to DB sync...');
    await this.pushStatisticsService.syncRedisToDatabase();
  }
}
