import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { PushStatistics } from './entities/push-statistics.entity';
import { PushMessage } from '../push-message/entities/push-message.entity';
import { PushStatisticsService } from './push-statistics.service';
import { PushStatisticsController } from './push-statistics.controller';
import { PushTrackingProcessor, PUSH_TRACKING_QUEUE } from './push-tracking.processor';
import { PushStatisticsCron } from './push-statistics.cron';
import { CacheModule } from '../../common/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PushStatistics, PushMessage]),
    BullModule.registerQueue({
      name: PUSH_TRACKING_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    CacheModule,
  ],
  controllers: [PushStatisticsController],
  providers: [PushStatisticsService, PushTrackingProcessor, PushStatisticsCron],
  exports: [PushStatisticsService],
})
export class PushStatisticsModule {}
