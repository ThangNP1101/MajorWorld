import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushMessage } from './entities/push-message.entity';
import { DeviceToken } from '../device-token/entities/device-token.entity';
import { TestDeviceToken } from '../test-device-token/entities/test-device-token.entity';
import { PushMessageService } from './push-message.service';
import { PushMessageController } from './push-message.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PushMessage, DeviceToken, TestDeviceToken]),
    UploadModule,
  ],
  controllers: [PushMessageController],
  providers: [PushMessageService],
  exports: [PushMessageService],
})
export class PushMessageModule {}

