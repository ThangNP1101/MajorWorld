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
exports.SplashImageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const splash_image_service_1 = require("./splash-image.service");
const splash_image_response_dto_1 = require("./dto/splash-image-response.dto");
let SplashImageController = class SplashImageController {
    constructor(splashImageService) {
        this.splashImageService = splashImageService;
    }
    async findAll() {
        return this.splashImageService.findAll();
    }
    async findByAspectRatio(aspectRatio) {
        return this.splashImageService.findByAspectRatio(aspectRatio);
    }
    async uploadImage(aspectRatio, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        return this.splashImageService.uploadImage(aspectRatio, file);
    }
    async deleteImage(aspectRatio) {
        return this.splashImageService.deleteImage(aspectRatio);
    }
};
exports.SplashImageController = SplashImageController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all splash images',
        description: 'Retrieve all splash images for different device aspect ratios, ordered by predefined sequence',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Splash images retrieved successfully',
        type: splash_image_response_dto_1.SplashImageResponseDto,
        isArray: true,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SplashImageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':aspectRatio'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get splash image by aspect ratio',
        description: 'Retrieve a single splash image for a specific aspect ratio',
    }),
    (0, swagger_1.ApiParam)({
        name: 'aspectRatio',
        description: 'Aspect ratio identifier (9:16, 9:19.5, 9:20, 9:18, 9:21, 9:19)',
        example: '9:16',
        enum: ['9:16', '9:19.5', '9:20', '9:18', '9:21', '9:19'],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Splash image retrieved successfully',
        type: splash_image_response_dto_1.SplashImageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Splash image not found',
    }),
    __param(0, (0, common_1.Param)('aspectRatio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SplashImageController.prototype, "findByAspectRatio", null);
__decorate([
    (0, common_1.Post)(':aspectRatio/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload splash image',
        description: 'Upload or update a splash image for a specific aspect ratio. Accepts JPEG, PNG, or WebP images (max 5MB)',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiParam)({
        name: 'aspectRatio',
        description: 'Aspect ratio identifier (9:16, 9:19.5, 9:20, 9:18, 9:21, 9:19)',
        example: '9:16',
        enum: ['9:16', '9:19.5', '9:20', '9:18', '9:21', '9:19'],
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file (JPEG, PNG, or WebP, max 5MB)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Splash image uploaded successfully',
        type: splash_image_response_dto_1.SplashImageResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid file or aspect ratio',
    }),
    __param(0, (0, common_1.Param)('aspectRatio')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SplashImageController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Delete)(':aspectRatio'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete splash image',
        description: 'Remove the splash image for a specific aspect ratio. The database record remains with null image URL',
    }),
    (0, swagger_1.ApiParam)({
        name: 'aspectRatio',
        description: 'Aspect ratio identifier (9:16, 9:19.5, 9:20, 9:18, 9:21, 9:19)',
        example: '9:16',
        enum: ['9:16', '9:19.5', '9:20', '9:18', '9:21', '9:19'],
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Splash image deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Splash image not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'No image uploaded for this aspect ratio',
    }),
    __param(0, (0, common_1.Param)('aspectRatio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SplashImageController.prototype, "deleteImage", null);
exports.SplashImageController = SplashImageController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Splash Images'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/splash-images'),
    __metadata("design:paramtypes", [splash_image_service_1.SplashImageService])
], SplashImageController);
//# sourceMappingURL=splash-image.controller.js.map