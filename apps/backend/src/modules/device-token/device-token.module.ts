import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { DeviceToken } from './entities/device-token.entity';
import { DeviceTokenService } from './device-token.service';
import { DeviceTokenController } from './device-token.controller';
import { DeviceTokenMobileController } from './device-token-mobile.controller';
import { DeviceTokenTopicProcessor } from './device-token-topic.processor';
import { DEVICE_TOKEN_QUEUE } from './constants/device-token-queue.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceToken]),
    BullModule.registerQueue({
      name: DEVICE_TOKEN_QUEUE.QUEUE_NAME,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  providers: [DeviceTokenService, DeviceTokenTopicProcessor],
  controllers: [DeviceTokenController, DeviceTokenMobileController],
  exports: [DeviceTokenService],
})
export class DeviceTokenModule {}

