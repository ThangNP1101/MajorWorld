import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppFeatures } from './entities/app-features.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppFeatures])],
})
export class AppFeaturesModule {}

