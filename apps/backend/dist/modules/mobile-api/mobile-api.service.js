"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileApiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_config_entity_1 = require("../app-config/entities/app-config.entity");
const bottom_menu_entity_1 = require("../bottom-menu/entities/bottom-menu.entity");
const splash_image_entity_1 = require("../splash-image/entities/splash-image.entity");
const app_features_entity_1 = require("../app-features/entities/app-features.entity");
const cache_service_1 = require("../../common/cache/cache.service");
const cache_constants_1 = require("../../common/cache/cache.constants");
const config_version_service_1 = require("../config-version/config-version.service");
let MobileApiService = class MobileApiService {
    constructor(appConfigRepository, bottomMenuRepository, splashImageRepository, appFeaturesRepository, cacheService, configVersionService) {
        this.appConfigRepository = appConfigRepository;
        this.bottomMenuRepository = bottomMenuRepository;
        this.splashImageRepository = splashImageRepository;
        this.appFeaturesRepository = appFeaturesRepository;
        this.cacheService = cacheService;
        this.configVersionService = configVersionService;
    }
    async getAppConfig() {
        const cached = await this.cacheService.get(cache_constants_1.CACHE_KEYS.APP_CONFIG);
        if (cached) {
            return cached;
        }
        const appConfig = await this.getOrCreateAppConfig();
        const menus = await this.bottomMenuRepository.find({
            where: { isActive: true },
            order: { sortOrder: "ASC" },
        });
        const splashImages = await this.splashImageRepository.find();
        const splashMap = {};
        splashImages.forEach((img) => {
            if (img.imageUrl) {
                splashMap[img.aspectRatio] = img.imageUrl;
            }
        });
        const appFeatures = await this.getOrCreateAppFeatures();
        const response = {
            theme: {
                tapMenuBg: appConfig.tapMenuBg,
                statusBarBg: appConfig.statusBarBg,
                titleBarBg: appConfig.titleBarBg,
                tapMenuTextColor: appConfig.tapMenuTextColor,
                titleTextColor: appConfig.titleTextColor,
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
            networkErrorMessage: appFeatures.networkErrorMessage ||
                "Please check your internet connection",
        };
        await this.cacheService.set(cache_constants_1.CACHE_KEYS.APP_CONFIG, response);
        return response;
    }
    async getConfigVersion() {
        const versions = await this.configVersionService.getVersions();
        return {
            version: versions.globalVersion,
            updatedAt: versions.lastUpdatedAt,
        };
    }
    async getOrCreateAppConfig() {
        let appConfig = await this.appConfigRepository.findOne({ where: {} });
        if (!appConfig) {
            appConfig = this.appConfigRepository.create({
                key: "default",
                tapMenuBg: "#9f7575",
                statusBarBg: "#000000",
                titleBarBg: "#FFFFFF",
                tapMenuTextColor: "#FFFFFF",
                titleTextColor: "#000000",
                version: 1,
            });
            await this.appConfigRepository.save(appConfig);
        }
        return appConfig;
    }
    async getOrCreateAppFeatures() {
        let appFeatures = await this.appFeaturesRepository.findOne({ where: {} });
        if (!appFeatures) {
            appFeatures = this.appFeaturesRepository.create({
                splashDuration: 2,
                popupEnabled: true,
                popupCycleDays: 7,
            });
            await this.appFeaturesRepository.save(appFeatures);
        }
        return appFeatures;
    }
};
exports.MobileApiService = MobileApiService;
exports.MobileApiService = MobileApiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(app_config_entity_1.AppConfig)),
    __param(1, (0, typeorm_1.InjectRepository)(bottom_menu_entity_1.BottomMenu)),
    __param(2, (0, typeorm_1.InjectRepository)(splash_image_entity_1.SplashImage)),
    __param(3, (0, typeorm_1.InjectRepository)(app_features_entity_1.AppFeatures)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cache_service_1.CacheService,
        config_version_service_1.ConfigVersionService])
], MobileApiService);
//# sourceMappingURL=mobile-api.service.js.map