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
exports.DeviceToken = exports.Platform = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var Platform;
(function (Platform) {
    Platform["ANDROID"] = "android";
    Platform["IOS"] = "ios";
})(Platform || (exports.Platform = Platform = {}));
let DeviceToken = class DeviceToken {
};
exports.DeviceToken = DeviceToken;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeviceToken.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID (nullable if not logged in)' }),
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], DeviceToken.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'FCM token' }),
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'fcm_token', length: 255 }),
    __metadata("design:type", String)
], DeviceToken.prototype, "fcmToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: Platform }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Platform,
    }),
    __metadata("design:type", String)
], DeviceToken.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'App version' }),
    (0, typeorm_1.Column)({ name: 'app_version', length: 20, nullable: true }),
    __metadata("design:type", String)
], DeviceToken.prototype, "appVersion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is token active' }),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], DeviceToken.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'last_seen_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], DeviceToken.prototype, "lastSeenAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DeviceToken.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], DeviceToken.prototype, "updatedAt", void 0);
exports.DeviceToken = DeviceToken = __decorate([
    (0, typeorm_1.Entity)('device_tokens')
], DeviceToken);
//# sourceMappingURL=device-token.entity.js.map