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
exports.SplashImageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const splash_image_entity_1 = require("./entities/splash-image.entity");
const upload_service_1 = require("../upload/upload.service");
const config_version_service_1 = require("../config-version/config-version.service");
const config_version_entity_1 = require("../config-version/entities/config-version.entity");
let SplashImageService = class SplashImageService {
    constructor(splashImageRepository, uploadService, configVersionService) {
        this.splashImageRepository = splashImageRepository;
        this.uploadService = uploadService;
        this.configVersionService = configVersionService;
    }
    async findAll() {
        return this.splashImageRepository.find();
    }
    async uploadImage(aspectRatio, file) {
        if (!file) {
            throw new common_1.NotFoundException("No file provided");
        }
        let splash = await this.splashImageRepository.findOne({
            where: { aspectRatio },
        });
        if (splash?.imageUrl) {
            await this.uploadService.deleteFile(splash.imageUrl);
        }
        const imageUrl = await this.uploadService.uploadFile(file, "splash-images");
        if (!splash) {
            splash = this.splashImageRepository.create({ aspectRatio, imageUrl });
        }
        else {
            splash.imageUrl = imageUrl;
        }
        const saved = await this.splashImageRepository.save(splash);
        await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.SPLASH_IMAGE);
        return saved;
    }
    async deleteImage(aspectRatio) {
        const splash = await this.splashImageRepository.findOne({
            where: { aspectRatio },
        });
        if (!splash) {
            throw new common_1.NotFoundException("Splash image not found");
        }
        if (splash.imageUrl) {
            await this.uploadService.deleteFile(splash.imageUrl);
            splash.imageUrl = null;
            await this.splashImageRepository.save(splash);
            await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.SPLASH_IMAGE);
        }
    }
};
exports.SplashImageService = SplashImageService;
exports.SplashImageService = SplashImageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(splash_image_entity_1.SplashImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        upload_service_1.UploadService,
        config_version_service_1.ConfigVersionService])
], SplashImageService);
//# sourceMappingURL=splash-image.service.js.map