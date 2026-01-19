import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileApiController } from './mobile-api.controller';
import { MobileApiService } from './mobile-api.service';
import { AppConfig } from '../app-config/entities/app-config.entity';
import { BottomMenu } from '../bottom-menu/entities/bottom-menu.entity';
import { SplashImage } from '../splash-image/entities/splash-image.entity';
import { AppFeatures } from '../app-features/entities/app-features.entity';
import { CacheModule } from '../../common/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppConfig, BottomMenu, SplashImage, AppFeatures]),
    CacheModule,
  ],
  controllers: [MobileApiController],
  providers: [MobileApiService],
})
export class MobileApiModule {}

