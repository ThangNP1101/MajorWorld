import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from './entities/device-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken])],
})
export class DeviceTokenModule {}

