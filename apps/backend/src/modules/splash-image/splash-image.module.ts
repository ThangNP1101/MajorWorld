import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SplashImage } from './entities/splash-image.entity';
import { SplashImageService } from './splash-image.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([SplashImage]), UploadModule],
  providers: [SplashImageService],
  exports: [SplashImageService],
})
export class SplashImageModule {}

