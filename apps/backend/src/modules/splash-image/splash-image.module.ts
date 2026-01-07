import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SplashImage } from './entities/splash-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SplashImage])],
})
export class SplashImageModule {}

