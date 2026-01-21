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
exports.TestDeviceToken = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const device_token_entity_1 = require("../../device-token/entities/device-token.entity");
let TestDeviceToken = class TestDeviceToken {
};
exports.TestDeviceToken = TestDeviceToken;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TestDeviceToken.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID (nullable if not logged in)' }),
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], TestDeviceToken.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'FCM token' }),
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'fcm_token', length: 255 }),
    __metadata("design:type", String)
], TestDeviceToken.prototype, "fcmToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: device_token_entity_1.Platform }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: device_token_entity_1.Platform,
        enumName: 'device_tokens_platform_enum',
    }),
    __metadata("design:type", String)
], TestDeviceToken.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'App version' }),
    (0, typeorm_1.Column)({ name: 'app_version', length: 20, nullable: true }),
    __metadata("design:type", String)
], TestDeviceToken.prototype, "appVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is token active' }),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], TestDeviceToken.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'last_seen_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], TestDeviceToken.prototype, "lastSeenAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TestDeviceToken.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TestDeviceToken.prototype, "updatedAt", void 0);
exports.TestDeviceToken = TestDeviceToken = __decorate([
    (0, typeorm_1.Entity)('test_device_tokens')
], TestDeviceToken);
//# sourceMappingURL=test-device-token.entity.js.map