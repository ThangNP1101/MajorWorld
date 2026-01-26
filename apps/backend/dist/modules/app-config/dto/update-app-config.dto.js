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
exports.UpdateAppConfigDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateAppConfigDto {
}
exports.UpdateAppConfigDto = UpdateAppConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#9f7575', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, {
        message: 'tapMenuBg must be a valid hex color code',
    }),
    __metadata("design:type", String)
], UpdateAppConfigDto.prototype, "tapMenuBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#000000', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, {
        message: 'statusBarBg must be a valid hex color code',
    }),
    __metadata("design:type", String)
], UpdateAppConfigDto.prototype, "statusBarBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#FFFFFF', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, {
        message: 'titleBarBg must be a valid hex color code',
    }),
    __metadata("design:type", String)
], UpdateAppConfigDto.prototype, "titleBarBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#FFFFFF', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, {
        message: 'tapMenuTextColor must be a valid hex color code',
    }),
    __metadata("design:type", String)
], UpdateAppConfigDto.prototype, "tapMenuTextColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '#000000', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^#[0-9A-Fa-f]{6}$/, {
        message: 'titleTextColor must be a valid hex color code',
    }),
    __metadata("design:type", String)
], UpdateAppConfigDto.prototype, "titleTextColor", void 0);
//# sourceMappingURL=update-app-config.dto.js.map