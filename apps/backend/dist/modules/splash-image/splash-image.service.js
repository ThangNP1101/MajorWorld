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
var SplashImageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashImageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const splash_image_entity_1 = require("./entities/splash-image.entity");
const upload_service_1 = require("../upload/upload.service");
const config_version_service_1 = require("../config-version/config-version.service");
const config_version_entity_1 = require("../config-version/entities/config-version.entity");
const splash_image_constants_1 = require("./splash-image.constants");
let SplashImageService = SplashImageService_1 = class SplashImageService {
    constructor(splashImageRepository, uploadService, configVersionService) {
        this.splashImageRepository = splashImageRepository;
        this.uploadService = uploadService;
        this.configVersionService = configVersionService;
        this.logger = new common_1.Logger(SplashImageService_1.name);
    }
    async findAll() {
        try {
            await this.ensureDefaults();
            const images = await this.splashImageRepository.find();
            const orderMap = new Map(splash_image_constants_1.DEFAULT_SPLASH_IMAGES.map((item, index) => [item.aspectRatio, index]));
            return images.sort((a, b) => {
                const orderA = orderMap.get(a.aspectRatio) ?? Number.MAX_SAFE_INTEGER;
                const orderB = orderMap.get(b.aspectRatio) ?? Number.MAX_SAFE_INTEGER;
                if (orderA !== orderB) {
                    return orderA - orderB;
                }
                return a.id - b.id;
            });
        }
        catch (error) {
            this.logger.error('Failed to fetch splash images', error.stack);
            throw error;
        }
    }
    async findByAspectRatio(aspectRatio) {
        try {
            await this.ensureDefaults();
            const splash = await this.splashImageRepository.findOne({
                where: { aspectRatio },
            });
            if (!splash) {
                throw new common_1.NotFoundException(`Splash image with aspect ratio ${aspectRatio} not found`);
            }
            return splash;
        }
        catch (error) {
            this.logger.error(`Failed to fetch splash image for ${aspectRatio}`, error.stack);
            throw error;
        }
    }
    async uploadImage(aspectRatio, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (!splash_image_constants_1.UPLOAD_CONSTRAINTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPEG, PNG, and WebP images are allowed');
        }
        if (file.size > splash_image_constants_1.UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
            throw new common_1.BadRequestException(`File size too large. Maximum allowed size is ${splash_image_constants_1.UPLOAD_CONSTRAINTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
        }
        try {
            await this.ensureDefaults();
            let splash = await this.splashImageRepository.findOne({
                where: { aspectRatio },
            });
            if (splash?.imageUrl) {
                try {
                    await this.uploadService.deleteFile(splash.imageUrl);
                    this.logger.log(`Deleted old splash image for aspect ratio ${aspectRatio}`);
                }
                catch (error) {
                    this.logger.warn(`Failed to delete old splash image: ${error.message}`);
                }
            }
            const imageUrl = await this.uploadService.uploadFile(file, splash_image_constants_1.UPLOAD_CONSTRAINTS.STORAGE_FOLDER);
            this.logger.log(`Uploaded new splash image for aspect ratio ${aspectRatio}`);
            if (!splash) {
                const defaults = this.getDefaultMeta(aspectRatio);
                if (!defaults) {
                    throw new common_1.BadRequestException(`Invalid aspect ratio: ${aspectRatio}. Supported ratios: ${splash_image_constants_1.DEFAULT_SPLASH_IMAGES.map((i) => i.aspectRatio).join(', ')}`);
                }
                splash = this.splashImageRepository.create({
                    aspectRatio,
                    imageUrl,
                    ...defaults,
                });
            }
            else {
                splash.imageUrl = imageUrl;
                const defaults = this.getDefaultMeta(aspectRatio);
                if (defaults) {
                    splash.deviceType = splash.deviceType ?? defaults.deviceType;
                    splash.dimensions = splash.dimensions ?? defaults.dimensions;
                }
            }
            const saved = await this.splashImageRepository.save(splash);
            await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.SPLASH_IMAGE);
            return saved;
        }
        catch (error) {
            this.logger.error(`Failed to upload splash image for ${aspectRatio}`, error.stack);
            throw error;
        }
    }
    async deleteImage(aspectRatio) {
        try {
            await this.ensureDefaults();
            const splash = await this.splashImageRepository.findOne({
                where: { aspectRatio },
            });
            if (!splash) {
                throw new common_1.NotFoundException(`Splash image with aspect ratio ${aspectRatio} not found`);
            }
            if (!splash.imageUrl) {
                throw new common_1.BadRequestException(`No image uploaded for aspect ratio ${aspectRatio}`);
            }
            try {
                await this.uploadService.deleteFile(splash.imageUrl);
                this.logger.log(`Deleted splash image for aspect ratio ${aspectRatio}`);
            }
            catch (error) {
                this.logger.warn(`Failed to delete file from storage: ${error.message}`);
            }
            splash.imageUrl = null;
            await this.splashImageRepository.save(splash);
            await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.SPLASH_IMAGE);
        }
        catch (error) {
            this.logger.error(`Failed to delete splash image for ${aspectRatio}`, error.stack);
            throw error;
        }
    }
    getDefaultMeta(aspectRatio) {
        const match = splash_image_constants_1.DEFAULT_SPLASH_IMAGES.find((item) => item.aspectRatio === aspectRatio);
        return match
            ? { deviceType: match.deviceType, dimensions: match.dimensions }
            : null;
    }
    async ensureDefaults() {
        const aspectRatios = splash_image_constants_1.DEFAULT_SPLASH_IMAGES.map((item) => item.aspectRatio);
        const existing = await this.splashImageRepository.find({
            where: { aspectRatio: (0, typeorm_2.In)(aspectRatios) },
            select: ['id', 'aspectRatio'],
        });
        const existingSet = new Set(existing.map((item) => item.aspectRatio));
        const missing = splash_image_constants_1.DEFAULT_SPLASH_IMAGES.filter((item) => !existingSet.has(item.aspectRatio));
        if (missing.length === 0) {
            return;
        }
        const entities = missing.map((item) => this.splashImageRepository.create({
            aspectRatio: item.aspectRatio,
            deviceType: item.deviceType,
            dimensions: item.dimensions,
        }));
        await this.splashImageRepository.save(entities);
        this.logger.log(`Created ${missing.length} default splash image entries: ${missing.map((i) => i.aspectRatio).join(', ')}`);
    }
};
exports.SplashImageService = SplashImageService;
exports.SplashImageService = SplashImageService = SplashImageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(splash_image_entity_1.SplashImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        upload_service_1.UploadService,
        config_version_service_1.ConfigVersionService])
], SplashImageService);
//# sourceMappingURL=splash-image.service.js.map