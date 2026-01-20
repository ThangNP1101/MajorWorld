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
exports.AppFeaturesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_features_entity_1 = require("./entities/app-features.entity");
const upload_service_1 = require("../upload/upload.service");
const config_version_service_1 = require("../config-version/config-version.service");
const config_version_entity_1 = require("../config-version/entities/config-version.entity");
let AppFeaturesService = class AppFeaturesService {
    constructor(appFeaturesRepository, uploadService, configVersionService) {
        this.appFeaturesRepository = appFeaturesRepository;
        this.uploadService = uploadService;
        this.configVersionService = configVersionService;
    }
    async getFeatures() {
        let features = await this.appFeaturesRepository.findOne({
            where: { id: 1 },
        });
        if (!features) {
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
    async updateFeatures(updateDto) {
        let features = await this.getFeatures();
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
        await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.APP_FEATURES);
        return saved;
    }
    async uploadPopupImage(file) {
        const features = await this.getFeatures();
        if (features.popupImageUrl) {
            await this.uploadService.deleteFile(features.popupImageUrl);
        }
        const imageUrl = await this.uploadService.uploadFile(file, 'app-features/popup');
        features.popupImageUrl = imageUrl;
        const saved = await this.appFeaturesRepository.save(features);
        await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.APP_FEATURES);
        return saved;
    }
    async deletePopupImage() {
        const features = await this.getFeatures();
        if (features.popupImageUrl) {
            await this.uploadService.deleteFile(features.popupImageUrl);
            features.popupImageUrl = null;
            await this.appFeaturesRepository.save(features);
            await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.APP_FEATURES);
        }
        return features;
    }
};
exports.AppFeaturesService = AppFeaturesService;
exports.AppFeaturesService = AppFeaturesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(app_features_entity_1.AppFeatures)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        upload_service_1.UploadService,
        config_version_service_1.ConfigVersionService])
], AppFeaturesService);
//# sourceMappingURL=app-features.service.js.map