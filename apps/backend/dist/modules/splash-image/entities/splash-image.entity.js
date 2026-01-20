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
exports.SplashImage = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let SplashImage = class SplashImage {
};
exports.SplashImage = SplashImage;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SplashImage.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Aspect ratio',
        example: '9:16',
        enum: ['9:16', '9:19.5', '9:20', '9:18', '9:21', '9:19'],
    }),
    (0, typeorm_1.Column)({ name: 'aspect_ratio', length: 10 }),
    __metadata("design:type", String)
], SplashImage.prototype, "aspectRatio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device type description',
        example: 'Regular smartphones',
    }),
    (0, typeorm_1.Column)({ name: 'device_type', length: 50, nullable: true }),
    __metadata("design:type", String)
], SplashImage.prototype, "deviceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Image dimensions', example: '1080 x 1920px' }),
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], SplashImage.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Image URL' }),
    (0, typeorm_1.Column)({ name: 'image_url', length: 255, nullable: true }),
    __metadata("design:type", String)
], SplashImage.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SplashImage.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SplashImage.prototype, "updatedAt", void 0);
exports.SplashImage = SplashImage = __decorate([
    (0, typeorm_1.Entity)('splash_images')
], SplashImage);
//# sourceMappingURL=splash-image.entity.js.map