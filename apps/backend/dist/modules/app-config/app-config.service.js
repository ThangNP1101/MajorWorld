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
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const app_config_entity_1 = require("./entities/app-config.entity");
const app_config_history_entity_1 = require("./entities/app-config-history.entity");
const config_version_service_1 = require("../config-version/config-version.service");
const config_version_entity_1 = require("../config-version/entities/config-version.entity");
let AppConfigService = class AppConfigService {
    constructor(appConfigRepository, appConfigHistoryRepository, configVersionService) {
        this.appConfigRepository = appConfigRepository;
        this.appConfigHistoryRepository = appConfigHistoryRepository;
        this.configVersionService = configVersionService;
    }
    async getConfig() {
        let config = await this.appConfigRepository.findOne({
            where: { key: "default" },
        });
        if (!config) {
            config = this.appConfigRepository.create({
                key: "default",
                version: 1,
                tapMenuBg: "#9f7575",
                statusBarBg: "#000000",
                titleBarBg: "#FFFFFF",
                tapMenuTextColor: "#FFFFFF",
                titleTextColor: "#000000",
            });
            await this.appConfigRepository.save(config);
        }
        return config;
    }
    async updateConfig(updateDto) {
        return this.appConfigRepository.manager.transaction(async (manager) => {
            const configRepo = manager.getRepository(app_config_entity_1.AppConfig);
            const historyRepo = manager.getRepository(app_config_history_entity_1.AppConfigHistory);
            let config = await configRepo.findOne({
                where: { key: "default" },
            });
            if (!config) {
                config = configRepo.create({
                    key: "default",
                    version: 1,
                    tapMenuBg: "#9f7575",
                    statusBarBg: "#000000",
                    titleBarBg: "#FFFFFF",
                    tapMenuTextColor: "#FFFFFF",
                    titleTextColor: "#000000",
                });
            }
            else {
                await historyRepo.save({
                    configKey: config.key,
                    version: config.version,
                    tapMenuBg: config.tapMenuBg,
                    statusBarBg: config.statusBarBg,
                    titleBarBg: config.titleBarBg,
                    tapMenuTextColor: config.tapMenuTextColor,
                    titleTextColor: config.titleTextColor,
                });
                config.version += 1;
            }
            if (updateDto.tapMenuBg)
                config.tapMenuBg = updateDto.tapMenuBg;
            if (updateDto.statusBarBg)
                config.statusBarBg = updateDto.statusBarBg;
            if (updateDto.titleBarBg)
                config.titleBarBg = updateDto.titleBarBg;
            if (updateDto.tapMenuTextColor)
                config.tapMenuTextColor = updateDto.tapMenuTextColor;
            if (updateDto.titleTextColor)
                config.titleTextColor = updateDto.titleTextColor;
            const saved = await configRepo.save(config);
            await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.APP_CONFIG);
            return saved;
        });
    }
    async rollback(toVersion) {
        return this.appConfigRepository.manager.transaction(async (manager) => {
            const configRepo = manager.getRepository(app_config_entity_1.AppConfig);
            const historyRepo = manager.getRepository(app_config_history_entity_1.AppConfigHistory);
            const config = (await configRepo.findOne({ where: { key: "default" } })) ||
                configRepo.create({
                    key: "default",
                    version: 1,
                    tapMenuBg: "#9f7575",
                    statusBarBg: "#000000",
                    titleBarBg: "#FFFFFF",
                    tapMenuTextColor: "#FFFFFF",
                    titleTextColor: "#000000",
                });
            const target = await historyRepo.findOne({
                where: { configKey: "default", version: toVersion },
            });
            if (!target) {
                throw new common_1.NotFoundException(`Version ${toVersion} not found`);
            }
            await historyRepo.save({
                configKey: config.key,
                version: config.version,
                tapMenuBg: config.tapMenuBg,
                statusBarBg: config.statusBarBg,
                titleBarBg: config.titleBarBg,
                tapMenuTextColor: config.tapMenuTextColor,
                titleTextColor: config.titleTextColor,
            });
            Object.assign(config, {
                tapMenuBg: target.tapMenuBg,
                statusBarBg: target.statusBarBg,
                titleBarBg: target.titleBarBg,
                tapMenuTextColor: target.tapMenuTextColor,
                titleTextColor: target.titleTextColor,
                version: config.version + 1,
            });
            const saved = await configRepo.save(config);
            await this.configVersionService.incrementVersion(config_version_entity_1.ModuleName.APP_CONFIG);
            return saved;
        });
    }
    async getConfigVersion() {
        const config = await this.getConfig();
        return {
            version: config.version,
            updatedAt: config.updatedAt.toISOString(),
        };
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(app_config_entity_1.AppConfig)),
    __param(1, (0, typeorm_1.InjectRepository)(app_config_history_entity_1.AppConfigHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_version_service_1.ConfigVersionService])
], AppConfigService);
//# sourceMappingURL=app-config.service.js.map