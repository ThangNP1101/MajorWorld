import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from './entities/device-token.entity';
import { DeviceTokenService } from './device-token.service';
import { DeviceTokenController } from './device-token.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken])],
  providers: [DeviceTokenService],
  controllers: [DeviceTokenController],
})
export class DeviceTokenModule {}

