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
exports.UpdatePushMessageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const push_message_entity_1 = require("../entities/push-message.entity");
class UpdatePushMessageDto {
}
exports.UpdatePushMessageDto = UpdatePushMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Push notification title', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdatePushMessageDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Android message content',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePushMessageDto.prototype, "androidMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Android big text (expanded content)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePushMessageDto.prototype, "androidBigtext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'iOS message content',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePushMessageDto.prototype, "iosMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Push notification image URL',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdatePushMessageDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Landing URL (deep link)',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdatePushMessageDto.prototype, "landingUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: push_message_entity_1.PushTarget,
        description: 'Target audience',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(push_message_entity_1.PushTarget),
    __metadata("design:type", String)
], UpdatePushMessageDto.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: push_message_entity_1.SendType,
        description: 'Send type',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(push_message_entity_1.SendType),
    __metadata("design:type", String)
], UpdatePushMessageDto.prototype, "sendType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scheduled date and time (ISO string)',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)((o) => o.sendType === push_message_entity_1.SendType.SCHEDULED),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePushMessageDto.prototype, "scheduledAt", void 0);
//# sourceMappingURL=update-push-message.dto.js.map