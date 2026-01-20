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
exports.ConfigVersionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_version_entity_1 = require("./entities/config-version.entity");
const cache_service_1 = require("../../common/cache/cache.service");
const cache_constants_1 = require("../../common/cache/cache.constants");
let ConfigVersionService = class ConfigVersionService {
    constructor(configVersionRepository, cacheService) {
        this.configVersionRepository = configVersionRepository;
        this.cacheService = cacheService;
        this.allModules = [
            config_version_entity_1.ModuleName.GLOBAL,
            config_version_entity_1.ModuleName.APP_CONFIG,
            config_version_entity_1.ModuleName.BOTTOM_MENU,
            config_version_entity_1.ModuleName.SPLASH_IMAGE,
            config_version_entity_1.ModuleName.APP_FEATURES,
        ];
    }
    async getVersions() {
        const cached = await this.cacheService.get(cache_constants_1.CACHE_KEYS.CONFIG_VERSIONS);
        if (cached) {
            return cached;
        }
        await this.ensureDefaults(this.allModules);
        const versions = await this.configVersionRepository.find();
        const versionMap = new Map(versions.map((v) => [v.moduleName, v]));
        const global = versionMap.get(config_version_entity_1.ModuleName.GLOBAL);
        const response = {
            globalVersion: global?.version ?? 1,
            lastUpdatedAt: global?.updatedAt?.toISOString() ?? new Date().toISOString(),
            modules: {
                appConfig: versionMap.get(config_version_entity_1.ModuleName.APP_CONFIG)?.version ?? 1,
                bottomMenu: versionMap.get(config_version_entity_1.ModuleName.BOTTOM_MENU)?.version ?? 1,
                splashImage: versionMap.get(config_version_entity_1.ModuleName.SPLASH_IMAGE)?.version ?? 1,
                appFeatures: versionMap.get(config_version_entity_1.ModuleName.APP_FEATURES)?.version ?? 1,
            },
        };
        await this.cacheService.set(cache_constants_1.CACHE_KEYS.CONFIG_VERSIONS, response, 30);
        return response;
    }
    async incrementVersion(moduleName) {
        await this.ensureDefaults([moduleName, config_version_entity_1.ModuleName.GLOBAL]);
        await this.configVersionRepository.manager.transaction(async (manager) => {
            const repo = manager.getRepository(config_version_entity_1.ConfigVersion);
            await repo
                .createQueryBuilder()
                .update(config_version_entity_1.ConfigVersion)
                .set({
                version: () => '"version" + 1',
                updatedAt: () => "CURRENT_TIMESTAMP",
            })
                .where('"module_name" = :moduleName', { moduleName })
                .execute();
            await repo
                .createQueryBuilder()
                .update(config_version_entity_1.ConfigVersion)
                .set({
                version: () => '"version" + 1',
                updatedAt: () => "CURRENT_TIMESTAMP",
            })
                .where('"module_name" = :moduleName', {
                moduleName: config_version_entity_1.ModuleName.GLOBAL,
            })
                .execute();
        });
        await this.cacheService.invalidate([
            cache_constants_1.CACHE_KEYS.CONFIG_VERSIONS,
            cache_constants_1.CACHE_KEYS.APP_CONFIG,
            cache_constants_1.CACHE_KEYS.APP_CONFIG_VERSION,
        ]);
    }
    async ensureDefaults(modules) {
        const existing = await this.configVersionRepository.find({
            where: { moduleName: (0, typeorm_2.In)(modules) },
        });
        const existingSet = new Set(existing.map((v) => v.moduleName));
        const missing = modules.filter((module) => !existingSet.has(module));
        if (missing.length === 0) {
            return;
        }
        const toCreate = missing.map((moduleName) => this.configVersionRepository.create({ moduleName, version: 1 }));
        await this.configVersionRepository.save(toCreate);
    }
};
exports.ConfigVersionService = ConfigVersionService;
exports.ConfigVersionService = ConfigVersionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(config_version_entity_1.ConfigVersion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cache_service_1.CacheService])
], ConfigVersionService);
//# sourceMappingURL=config-version.service.js.map