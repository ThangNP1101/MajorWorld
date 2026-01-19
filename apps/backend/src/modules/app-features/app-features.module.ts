import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppFeatures } from './entities/app-features.entity';
import { AppFeaturesController } from './app-features.controller';
import { AppFeaturesService } from './app-features.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([AppFeatures]), UploadModule],
  controllers: [AppFeaturesController],
  providers: [AppFeaturesService],
  exports: [AppFeaturesService],
})
export class AppFeaturesModule {}
