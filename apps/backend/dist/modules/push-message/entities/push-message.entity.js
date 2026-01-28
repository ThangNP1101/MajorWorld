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
exports.PushMessage = exports.SendType = exports.PushStatus = exports.PushTarget = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var PushTarget;
(function (PushTarget) {
    PushTarget["ALL"] = "all";
    PushTarget["ANDROID"] = "android";
    PushTarget["IOS"] = "ios";
})(PushTarget || (exports.PushTarget = PushTarget = {}));
var PushStatus;
(function (PushStatus) {
    PushStatus["DRAFT"] = "draft";
    PushStatus["SCHEDULED"] = "scheduled";
    PushStatus["SENDING"] = "sending";
    PushStatus["SENT"] = "sent";
})(PushStatus || (exports.PushStatus = PushStatus = {}));
var SendType;
(function (SendType) {
    SendType["IMMEDIATE"] = "immediate";
    SendType["SCHEDULED"] = "scheduled";
})(SendType || (exports.SendType = SendType = {}));
let PushMessage = class PushMessage {
};
exports.PushMessage = PushMessage;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PushMessage.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Push notification title' }),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], PushMessage.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Android message content' }),
    (0, typeorm_1.Column)({ name: 'android_message', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PushMessage.prototype, "androidMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Android big text (expanded content)' }),
    (0, typeorm_1.Column)({ name: 'android_bigtext', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PushMessage.prototype, "androidBigtext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'iOS message content' }),
    (0, typeorm_1.Column)({ name: 'ios_message', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PushMessage.prototype, "iosMessage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Push notification image URL (800x464)' }),
    (0, typeorm_1.Column)({ name: 'image_url', length: 255, nullable: true }),
    __metadata("design:type", String)
], PushMessage.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Landing URL (deep link)' }),
    (0, typeorm_1.Column)({ name: 'landing_url', length: 255, nullable: true }),
    __metadata("design:type", String)
], PushMessage.prototype, "landingUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PushTarget }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PushTarget,
        default: PushTarget.ALL,
    }),
    __metadata("design:type", String)
], PushMessage.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PushStatus }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PushStatus,
        default: PushStatus.DRAFT,
    }),
    __metadata("design:type", String)
], PushMessage.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SendType }),
    (0, typeorm_1.Column)({
        name: 'send_type',
        type: 'enum',
        enum: SendType,
        default: SendType.IMMEDIATE,
    }),
    __metadata("design:type", String)
], PushMessage.prototype, "sendType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'scheduled_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PushMessage.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'scheduled_job_id', length: 64, nullable: true }),
    __metadata("design:type", String)
], PushMessage.prototype, "scheduledJobId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'sent_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PushMessage.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'total_sent', default: 0 }),
    __metadata("design:type", Number)
], PushMessage.prototype, "totalSent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'total_views', default: 0 }),
    __metadata("design:type", Number)
], PushMessage.prototype, "totalViews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PushMessage.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PushMessage.prototype, "updatedAt", void 0);
exports.PushMessage = PushMessage = __decorate([
    (0, typeorm_1.Entity)('push_messages')
], PushMessage);
//# sourceMappingURL=push-message.entity.js.map