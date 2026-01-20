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
exports.AppFeaturesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const app_features_service_1 = require("./app-features.service");
const update_app_features_dto_1 = require("./dto/update-app-features.dto");
const app_features_entity_1 = require("./entities/app-features.entity");
let AppFeaturesController = class AppFeaturesController {
    constructor(appFeaturesService) {
        this.appFeaturesService = appFeaturesService;
    }
    async getFeatures() {
        return this.appFeaturesService.getFeatures();
    }
    async updateFeatures(updateDto) {
        return this.appFeaturesService.updateFeatures(updateDto);
    }
    async uploadPopupImage(file) {
        return this.appFeaturesService.uploadPopupImage(file);
    }
    async deletePopupImage() {
        return this.appFeaturesService.deletePopupImage();
    }
};
exports.AppFeaturesController = AppFeaturesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get app features configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuration retrieved successfully',
        type: app_features_entity_1.AppFeatures,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppFeaturesController.prototype, "getFeatures", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update app features configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuration updated successfully',
        type: app_features_entity_1.AppFeatures,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_app_features_dto_1.UpdateAppFeaturesDto]),
    __metadata("design:returntype", Promise)
], AppFeaturesController.prototype, "updateFeatures", null);
__decorate([
    (0, common_1.Post)('upload-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload popup marketing image' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (jpg, png, gif, webp)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Image uploaded successfully',
        type: app_features_entity_1.AppFeatures,
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppFeaturesController.prototype, "uploadPopupImage", null);
__decorate([
    (0, common_1.Delete)('popup-image'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete popup marketing image' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Image deleted successfully',
        type: app_features_entity_1.AppFeatures,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppFeaturesController.prototype, "deletePopupImage", null);
exports.AppFeaturesController = AppFeaturesController = __decorate([
    (0, swagger_1.ApiTags)('Admin - App Features'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/app-features'),
    __metadata("design:paramtypes", [app_features_service_1.AppFeaturesService])
], AppFeaturesController);
//# sourceMappingURL=app-features.controller.js.map