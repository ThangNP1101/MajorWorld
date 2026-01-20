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
exports.MobileApiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mobile_api_service_1 = require("./mobile-api.service");
const app_config_response_dto_1 = require("./dto/app-config-response.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let MobileApiController = class MobileApiController {
    constructor(mobileApiService) {
        this.mobileApiService = mobileApiService;
    }
    async getConfig(res) {
        const config = await this.mobileApiService.getAppConfig();
        const version = await this.mobileApiService.getConfigVersion();
        res.setHeader('ETag', `"v${version.version}"`);
        return config;
    }
    async getConfigVersion() {
        return this.mobileApiService.getConfigVersion();
    }
};
exports.MobileApiController = MobileApiController;
__decorate([
    (0, common_1.Get)('config'),
    (0, swagger_1.ApiOperation)({ summary: 'Get app configuration for mobile app' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'App configuration retrieved successfully',
        type: app_config_response_dto_1.AppConfigResponseDto,
    }),
    (0, common_1.Header)('Cache-Control', 'public, max-age=60, stale-while-revalidate=300'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileApiController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Get)('config/version'),
    (0, swagger_1.ApiOperation)({ summary: 'Get app configuration version only' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'App configuration version retrieved successfully',
    }),
    (0, common_1.Header)('Cache-Control', 'public, max-age=30'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MobileApiController.prototype, "getConfigVersion", null);
exports.MobileApiController = MobileApiController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiTags)('Mobile API'),
    (0, common_1.Controller)('v1/app'),
    __metadata("design:paramtypes", [mobile_api_service_1.MobileApiService])
], MobileApiController);
//# sourceMappingURL=mobile-api.controller.js.map