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
exports.CreateDeviceTokenDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const device_token_entity_1 = require("../entities/device-token.entity");
class CreateDeviceTokenDto {
}
exports.CreateDeviceTokenDto = CreateDeviceTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID (nullable if not logged in)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateDeviceTokenDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'FCM token' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateDeviceTokenDto.prototype, "fcmToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: device_token_entity_1.Platform }),
    (0, class_validator_1.IsEnum)(device_token_entity_1.Platform),
    __metadata("design:type", String)
], CreateDeviceTokenDto.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'App version', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateDeviceTokenDto.prototype, "appVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is token active', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDeviceTokenDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last seen at (ISO string)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDeviceTokenDto.prototype, "lastSeenAt", void 0);
//# sourceMappingURL=create-device-token.dto.js.map