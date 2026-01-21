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
exports.SplashImageResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SplashImageResponseDto {
}
exports.SplashImageResponseDto = SplashImageResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Splash image ID' }),
    __metadata("design:type", Number)
], SplashImageResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Aspect ratio',
        example: '9:16',
    }),
    __metadata("design:type", String)
], SplashImageResponseDto.prototype, "aspectRatio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Device type description',
        example: 'Regular smartphones',
    }),
    __metadata("design:type", String)
], SplashImageResponseDto.prototype, "deviceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Image dimensions',
        example: '1080 x 1920px',
    }),
    __metadata("design:type", String)
], SplashImageResponseDto.prototype, "dimensions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Image URL',
        nullable: true,
    }),
    __metadata("design:type", String)
], SplashImageResponseDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created timestamp' }),
    __metadata("design:type", Date)
], SplashImageResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated timestamp' }),
    __metadata("design:type", Date)
], SplashImageResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=splash-image-response.dto.js.map