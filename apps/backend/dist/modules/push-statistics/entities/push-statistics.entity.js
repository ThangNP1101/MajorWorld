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
exports.PushStatistics = exports.EventType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const push_message_entity_1 = require("../../push-message/entities/push-message.entity");
const device_token_entity_1 = require("../../device-token/entities/device-token.entity");
var EventType;
(function (EventType) {
    EventType["SENT"] = "sent";
    EventType["DELIVERED"] = "delivered";
    EventType["OPENED"] = "opened";
    EventType["CLICKED"] = "clicked";
})(EventType || (exports.EventType = EventType = {}));
let PushStatistics = class PushStatistics {
};
exports.PushStatistics = PushStatistics;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PushStatistics.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'push_message_id' }),
    __metadata("design:type", Number)
], PushStatistics.prototype, "pushMessageId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ name: 'device_token_id', type: 'uuid' }),
    __metadata("design:type", String)
], PushStatistics.prototype, "deviceTokenId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: EventType }),
    (0, typeorm_1.Column)({
        name: 'event_type',
        type: 'enum',
        enum: EventType,
    }),
    __metadata("design:type", String)
], PushStatistics.prototype, "eventType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PushStatistics.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => push_message_entity_1.PushMessage),
    (0, typeorm_1.JoinColumn)({ name: 'push_message_id' }),
    __metadata("design:type", push_message_entity_1.PushMessage)
], PushStatistics.prototype, "pushMessage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => device_token_entity_1.DeviceToken),
    (0, typeorm_1.JoinColumn)({ name: 'device_token_id' }),
    __metadata("design:type", device_token_entity_1.DeviceToken)
], PushStatistics.prototype, "deviceToken", void 0);
exports.PushStatistics = PushStatistics = __decorate([
    (0, typeorm_1.Entity)('push_statistics')
], PushStatistics);
//# sourceMappingURL=push-statistics.entity.js.map