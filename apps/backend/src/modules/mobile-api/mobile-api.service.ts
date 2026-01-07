import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfig } from '../app-config/entities/app-config.entity';
import { BottomMenu } from '../bottom-menu/entities/bottom-menu.entity';
import { SplashImage } from '../splash-image/entities/splash-image.entity';
import { AppFeatures } from '../app-features/entities/app-features.entity';
import { AppConfigResponseDto } from './dto/app-config-response.dto';

@Injectable()
export class MobileApiService {
  constructor(
    @InjectRepository(AppConfig)
    private appConfigRepository: Repository<AppConfig>,
    @InjectRepository(BottomMenu)
    private bottomMenuRepository: Repository<BottomMenu>,
    @InjectRepository(SplashImage)
    private splashImageRepository: Repository<SplashImage>,
    @InjectRepository(AppFeatures)
    private appFeaturesRepository: Repository<AppFeatures>,
  ) {}

  async getAppConfig(): Promise<AppConfigResponseDto> {
    // Get or create default config
    let appConfig = await this.appConfigRepository.findOne({ where: {} });
    if (!appConfig) {
      appConfig = this.appConfigRepository.create({
        tapMenuBg: '#9f7575',
        statusBarBg: '#000000',
        titleBarBg: '#FFFFFF',
      });
      await this.appConfigRepository.save(appConfig);
    }

    // Get active menus
    const menus = await this.bottomMenuRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });

    // Get splash images
    const splashImages = await this.splashImageRepository.find();
    const splashMap: Record<string, string> = {};
    splashImages.forEach((img) => {
      if (img.imageUrl) {
        splashMap[img.aspectRatio] = img.imageUrl;
      }
    });

    // Get app features
    let appFeatures = await this.appFeaturesRepository.findOne({ where: {} });
    if (!appFeatures) {
      appFeatures = this.appFeaturesRepository.create({
        splashDuration: 2,
        popupEnabled: true,
        popupCycleDays: 7,
      });
      await this.appFeaturesRepository.save(appFeatures);
    }

    // Build response
    return {
      theme: {
        tapMenuBg: appConfig.tapMenuBg,
        statusBarBg: appConfig.statusBarBg,
        titleBarBg: appConfig.titleBarBg,
      },
      menus: menus.map((menu) => ({
        id: menu.id,
        name: menu.menuName,
        url: menu.connectionUrl,
        iconActive: menu.iconActive,
        iconInactive: menu.iconInactive,
        order: menu.sortOrder,
      })),
      splash: {
        duration: appFeatures.splashDuration,
        images: splashMap,
      },
      popup: {
        enabled: appFeatures.popupEnabled,
        cycleDays: appFeatures.popupCycleDays,
        imageUrl: appFeatures.popupImageUrl,
        buttonText: appFeatures.popupButtonText || 'Sign up for alerts',
        buttonTextColor: appFeatures.popupButtonTextColor,
        buttonBgColor: appFeatures.popupButtonBgColor,
      },
      social: {
        instagram: appFeatures.instagramUrl,
        kakaotalk: appFeatures.kakaotalkUrl,
        youtube: appFeatures.youtubeUrl,
      },
      networkErrorMessage:
        appFeatures.networkErrorMessage ||
        'Please check your internet connection',
    };
  }
}

