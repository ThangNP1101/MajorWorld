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
exports.AppFeatures = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let AppFeatures = class AppFeatures {
};
exports.AppFeatures = AppFeatures;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AppFeatures.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Splash screen duration in seconds', example: 2 }),
    (0, typeorm_1.Column)({ name: 'splash_duration', default: 2 }),
    __metadata("design:type", Number)
], AppFeatures.prototype, "splashDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Enable popup' }),
    (0, typeorm_1.Column)({ name: 'popup_enabled', default: true }),
    __metadata("design:type", Boolean)
], AppFeatures.prototype, "popupEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Popup exposure cycle in days', example: 7 }),
    (0, typeorm_1.Column)({ name: 'popup_cycle_days', default: 7 }),
    __metadata("design:type", Number)
], AppFeatures.prototype, "popupCycleDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Popup marketing image URL' }),
    (0, typeorm_1.Column)({ name: 'popup_image_url', length: 255, nullable: true }),
    __metadata("design:type", String)
], AppFeatures.prototype, "popupImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Popup button text', example: 'Sign up for alerts' }),
    (0, typeorm_1.Column)({ name: 'popup_button_text', length: 50, nullable: true }),
    __metadata("design:type", String)
], AppFeatures.prototype, "popupButtonText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Popup button text color', example: '#FFFFFF' }),
    (0, typeorm_1.Column)({ name: 'popup_button_text_color', length: 7, default: '#FFFFFF' }),
    __metadata("design:type", String)
], AppFeatures.prototype, "popupButtonTextColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Popup button background color',
        example: '#000000',
    }),
    (0, typeorm_1.Column)({ name: 'popup_button_bg_color', length: 7, default: '#000000' }),
    __metadata("design:type", String)
], AppFeatures.prototype, "popupButtonBgColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Instagram URL' }),
    (0, typeorm_1.Column)({ name: 'instagram_url', length: 255, nullable: true }),
    __metadata("design:type", String)
], AppFeatures.prototype, "instagramUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'KakaoTalk channel URL' }),
    (0, typeorm_1.Column)({ name: 'kakaotalk_url', length: 255, nullable: true }),
    __metadata("design:type", String)
], AppFeatures.prototype, "kakaotalkUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'YouTube channel URL' }),
    (0, typeorm_1.Column)({ name: 'youtube_url', length: 255, nullable: true }),
    __metadata("design:type", String)
], AppFeatures.prototype, "youtubeUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Network error message' }),
    (0, typeorm_1.Column)({ name: 'network_error_message', type: 'text', nullable: true }),
    __metadata("design:type", String)
], AppFeatures.prototype, "networkErrorMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AppFeatures.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AppFeatures.prototype, "updatedAt", void 0);
exports.AppFeatures = AppFeatures = __decorate([
    (0, typeorm_1.Entity)('app_features')
], AppFeatures);
//# sourceMappingURL=app-features.entity.js.map