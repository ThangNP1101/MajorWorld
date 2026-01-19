import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigController } from './app-config.controller';
import { AppConfigService } from './app-config.service';
import { AppConfig } from './entities/app-config.entity';
import { AppConfigHistory } from './entities/app-config-history.entity';
import { CacheModule } from '../../common/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppConfig, AppConfigHistory]), CacheModule],
  controllers: [AppConfigController],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}

