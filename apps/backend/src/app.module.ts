import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { DatabaseConfig } from './database/database.config';
import { AppConfigModule } from './modules/app-config/app-config.module';
import { BottomMenuModule } from './modules/bottom-menu/bottom-menu.module';
import { SplashImageModule } from './modules/splash-image/splash-image.module';
import { AppFeaturesModule } from './modules/app-features/app-features.module';
import { PushMessageModule } from './modules/push-message/push-message.module';
import { DeviceTokenModule } from './modules/device-token/device-token.module';
import { PushStatisticsModule } from './modules/push-statistics/push-statistics.module';
import { UploadModule } from './modules/upload/upload.module';
import { MobileApiModule } from './modules/mobile-api/mobile-api.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Queue (Redis)
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),

    // Feature Modules
    AppConfigModule,
    BottomMenuModule,
    SplashImageModule,
    AppFeaturesModule,
    PushMessageModule,
    DeviceTokenModule,
    PushStatisticsModule,
    UploadModule,
    MobileApiModule,
  ],
})
export class AppModule {}

