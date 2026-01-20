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
exports.UpdateAppFeaturesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateAppFeaturesDto {
}
exports.UpdateAppFeaturesDto = UpdateAppFeaturesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Splash screen duration in seconds', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdateAppFeaturesDto.prototype, "splashDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Enable popup', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAppFeaturesDto.prototype, "popupEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7, description: 'Popup exposure cycle in days', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], UpdateAppFeaturesDto.prototype, "popupCycleDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sign up for alerts', description: 'Popup button text', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateAppFeaturesDto.prototype, "popupButtonText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#FFFFFF', description: 'Popup button text color', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, {
        message: 'popupButtonTextColor must be a valid hex color code',
    }),
    __metadata("design:type", String)
], UpdateAppFeaturesDto.prototype, "popupButtonTextColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#000000', description: 'Popup button background color', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, {
        message: 'popupButtonBgColor must be a valid hex color code',
    }),
    __metadata("design:type", String)
], UpdateAppFeaturesDto.prototype, "popupButtonBgColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://instagram.com/...', description: 'Instagram URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({}, { message: 'instagramUrl must be a valid URL' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateAppFeaturesDto.prototype, "instagramUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://pf.kakao.com/...', description: 'KakaoTalk channel URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({}, { message: 'kakaotalkUrl must be a valid URL' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateAppFeaturesDto.prototype, "kakaotalkUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://youtube.com/@...', description: 'YouTube channel URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({}, { message: 'youtubeUrl must be a valid URL' }),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateAppFeaturesDto.prototype, "youtubeUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Please check your internet connection', description: 'Network error message', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAppFeaturesDto.prototype, "networkErrorMessage", void 0);
//# sourceMappingURL=update-app-features.dto.js.map