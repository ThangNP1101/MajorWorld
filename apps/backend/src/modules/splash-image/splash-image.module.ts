import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SplashImage } from './entities/splash-image.entity';
import { SplashImageService } from './splash-image.service';
import { SplashImageController } from './splash-image.controller';
import { UploadModule } from '../upload/upload.module';
import { ConfigVersionModule } from '../config-version/config-version.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SplashImage]),
    UploadModule,
    ConfigVersionModule,
  ],
  controllers: [SplashImageController],
  providers: [SplashImageService],
  exports: [SplashImageService],
})
export class SplashImageModule {}

