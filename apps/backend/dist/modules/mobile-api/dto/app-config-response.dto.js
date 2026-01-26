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
exports.AppConfigResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ThemeDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeDto.prototype, "tapMenuBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeDto.prototype, "statusBarBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeDto.prototype, "titleBarBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeDto.prototype, "tapMenuTextColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ThemeDto.prototype, "titleTextColor", void 0);
class MenuItemDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MenuItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MenuItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MenuItemDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MenuItemDto.prototype, "iconActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MenuItemDto.prototype, "iconInactive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MenuItemDto.prototype, "order", void 0);
class SplashDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SplashDto.prototype, "duration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], SplashDto.prototype, "images", void 0);
class PopupDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PopupDto.prototype, "enabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PopupDto.prototype, "cycleDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PopupDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PopupDto.prototype, "buttonText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PopupDto.prototype, "buttonTextColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PopupDto.prototype, "buttonBgColor", void 0);
class SocialDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SocialDto.prototype, "instagram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SocialDto.prototype, "kakaotalk", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SocialDto.prototype, "youtube", void 0);
class AppConfigResponseDto {
}
exports.AppConfigResponseDto = AppConfigResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: ThemeDto }),
    __metadata("design:type", ThemeDto)
], AppConfigResponseDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MenuItemDto] }),
    __metadata("design:type", Array)
], AppConfigResponseDto.prototype, "menus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SplashDto }),
    __metadata("design:type", SplashDto)
], AppConfigResponseDto.prototype, "splash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: PopupDto }),
    __metadata("design:type", PopupDto)
], AppConfigResponseDto.prototype, "popup", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SocialDto }),
    __metadata("design:type", SocialDto)
], AppConfigResponseDto.prototype, "social", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AppConfigResponseDto.prototype, "networkErrorMessage", void 0);
//# sourceMappingURL=app-config-response.dto.js.map