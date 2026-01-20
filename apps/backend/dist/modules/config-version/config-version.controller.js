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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigVersionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_version_service_1 = require("./config-version.service");
const config_versions_response_dto_1 = require("./dto/config-versions-response.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let ConfigVersionController = class ConfigVersionController {
    constructor(configVersionService) {
        this.configVersionService = configVersionService;
    }
    async getVersions() {
        return this.configVersionService.getVersions();
    }
};
exports.ConfigVersionController = ConfigVersionController;
__decorate([
    (0, common_1.Get)("versions"),
    (0, swagger_1.ApiOperation)({ summary: "Get all config versions for mobile app polling" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Config versions retrieved successfully",
        type: config_versions_response_dto_1.ConfigVersionsResponseDto,
    }),
    (0, common_1.Header)("Cache-Control", "public, max-age=5"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigVersionController.prototype, "getVersions", null);
exports.ConfigVersionController = ConfigVersionController = __decorate([
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiTags)("Mobile API"),
    (0, common_1.Controller)("v1/app"),
    __metadata("design:paramtypes", [config_version_service_1.ConfigVersionService])
], ConfigVersionController);
//# sourceMappingURL=config-version.controller.js.map