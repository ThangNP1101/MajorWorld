import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushStatistics } from './entities/push-statistics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PushStatistics])],
})
export class PushStatisticsModule {}

