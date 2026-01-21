import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDeviceToken } from './entities/test-device-token.entity';
import { TestDeviceTokenService } from './test-device-token.service';
import { TestDeviceTokenController } from './test-device-token.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TestDeviceToken])],
  providers: [TestDeviceTokenService],
  controllers: [TestDeviceTokenController],
})
export class TestDeviceTokenModule {}
