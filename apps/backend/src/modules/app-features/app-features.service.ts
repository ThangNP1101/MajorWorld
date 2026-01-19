import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppFeatures } from './entities/app-features.entity';
import { UpdateAppFeaturesDto } from './dto/update-app-features.dto';
import { UploadService } from '../upload/upload.service';
import { ConfigVersionService } from '../config-version/config-version.service';
import { ModuleName } from '../config-version/entities/config-version.entity';

@Injectable()
export class AppFeaturesService {
  constructor(
    @InjectRepository(AppFeatures)
    private appFeaturesRepository: Repository<AppFeatures>,
    private uploadService: UploadService,
    private readonly configVersionService: ConfigVersionService,
  ) {}

  async getFeatures(): Promise<AppFeatures> {
    let features = await this.appFeaturesRepository.findOne({
      where: { id: 1 },
    });

    if (!features) {
      // Create default config if none exists
      features = this.appFeaturesRepository.create({
        id: 1,
        splashDuration: 2,
        popupEnabled: true,
        popupCycleDays: 7,
        popupButtonTextColor: '#FFFFFF',
        popupButtonBgColor: '#000000',
      });
      await this.appFeaturesRepository.save(features);
    }

    return features;
  }

  async updateFeatures(updateDto: UpdateAppFeaturesDto): Promise<AppFeatures> {
    let features = await this.getFeatures();

    // Update only provided fields
    if (updateDto.splashDuration !== undefined) {
      features.splashDuration = updateDto.splashDuration;
    }
    if (updateDto.popupEnabled !== undefined) {
      features.popupEnabled = updateDto.popupEnabled;
    }
    if (updateDto.popupCycleDays !== undefined) {
      features.popupCycleDays = updateDto.popupCycleDays;
    }
    if (updateDto.popupButtonText !== undefined) {
      features.popupButtonText = updateDto.popupButtonText;
    }
    if (updateDto.popupButtonTextColor !== undefined) {
      features.popupButtonTextColor = updateDto.popupButtonTextColor;
    }
    if (updateDto.popupButtonBgColor !== undefined) {
      features.popupButtonBgColor = updateDto.popupButtonBgColor;
    }
    if (updateDto.instagramUrl !== undefined) {
      features.instagramUrl = updateDto.instagramUrl;
    }
    if (updateDto.kakaotalkUrl !== undefined) {
      features.kakaotalkUrl = updateDto.kakaotalkUrl;
    }
    if (updateDto.youtubeUrl !== undefined) {
      features.youtubeUrl = updateDto.youtubeUrl;
    }
    if (updateDto.networkErrorMessage !== undefined) {
      features.networkErrorMessage = updateDto.networkErrorMessage;
    }

    const saved = await this.appFeaturesRepository.save(features);
    await this.configVersionService.incrementVersion(ModuleName.APP_FEATURES);
    return saved;
  }

  async uploadPopupImage(file: Express.Multer.File): Promise<AppFeatures> {
    const features = await this.getFeatures();

    // Delete old image if exists
    if (features.popupImageUrl) {
      await this.uploadService.deleteFile(features.popupImageUrl);
    }

    // Upload new image
    const imageUrl = await this.uploadService.uploadFile(file, 'app-features/popup');
    features.popupImageUrl = imageUrl;

    const saved = await this.appFeaturesRepository.save(features);
    await this.configVersionService.incrementVersion(ModuleName.APP_FEATURES);
    return saved;
  }

  async deletePopupImage(): Promise<AppFeatures> {
    const features = await this.getFeatures();

    if (features.popupImageUrl) {
      await this.uploadService.deleteFile(features.popupImageUrl);
      features.popupImageUrl = null;
      await this.appFeaturesRepository.save(features);
      await this.configVersionService.incrementVersion(ModuleName.APP_FEATURES);
    }

    return features;
  }
}
