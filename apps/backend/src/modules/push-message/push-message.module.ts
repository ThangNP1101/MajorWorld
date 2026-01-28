import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { PushMessage } from './entities/push-message.entity';
import { DeviceToken } from '../device-token/entities/device-token.entity';
import { TestDeviceToken } from '../test-device-token/entities/test-device-token.entity';
import { PushMessageService } from './push-message.service';
import { PushMessageController } from './push-message.controller';
import { UploadModule } from '../upload/upload.module';
import { PushScheduledProcessor } from './push-scheduled.processor';
import { PUSH_MESSAGE_QUEUE } from './push-message-queue.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([PushMessage, DeviceToken, TestDeviceToken]),
    BullModule.registerQueue({
      name: PUSH_MESSAGE_QUEUE.QUEUE_NAME,
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
    UploadModule,
  ],
  controllers: [PushMessageController],
  providers: [PushMessageService, PushScheduledProcessor],
  exports: [PushMessageService],
})
export class PushMessageModule {}

