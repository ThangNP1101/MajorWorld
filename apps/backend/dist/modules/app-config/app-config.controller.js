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
exports.AppConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_config_service_1 = require("./app-config.service");
const update_app_config_dto_1 = require("./dto/update-app-config.dto");
const app_config_entity_1 = require("./entities/app-config.entity");
const rollback_app_config_dto_1 = require("./dto/rollback-app-config.dto");
let AppConfigController = class AppConfigController {
    constructor(appConfigService) {
        this.appConfigService = appConfigService;
    }
    async getConfig() {
        return this.appConfigService.getConfig();
    }
    async getConfigVersion() {
        return this.appConfigService.getConfigVersion();
    }
    async updateColors(updateDto) {
        return this.appConfigService.updateConfig(updateDto);
    }
    async rollback(rollbackDto) {
        return this.appConfigService.rollback(rollbackDto.version);
    }
};
exports.AppConfigController = AppConfigController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get app design configuration" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Configuration retrieved successfully",
        type: app_config_entity_1.AppConfig,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Get)("version"),
    (0, swagger_1.ApiOperation)({ summary: "Get app design configuration version" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Configuration version retrieved successfully",
        schema: {
            type: "object",
            properties: {
                version: { type: "number" },
                updatedAt: { type: "string", format: "date-time" },
            },
            example: { version: 1, updatedAt: "2024-01-01T00:00:00.000Z" },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "getConfigVersion", null);
__decorate([
    (0, common_1.Put)("colors"),
    (0, swagger_1.ApiOperation)({ summary: "Update app theme colors" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Colors updated successfully",
        type: app_config_entity_1.AppConfig,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_app_config_dto_1.UpdateAppConfigDto]),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "updateColors", null);
__decorate([
    (0, common_1.Put)("rollback"),
    (0, swagger_1.ApiOperation)({ summary: "Rollback app theme to a previous version" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Rollback completed successfully",
        type: app_config_entity_1.AppConfig,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rollback_app_config_dto_1.RollbackAppConfigDto]),
    __metadata("design:returntype", Promise)
], AppConfigController.prototype, "rollback", null);
exports.AppConfigController = AppConfigController = __decorate([
    (0, swagger_1.ApiTags)("Admin - App Config"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("admin/app-design"),
    __metadata("design:paramtypes", [app_config_service_1.AppConfigService])
], AppConfigController);
//# sourceMappingURL=app-config.controller.js.map