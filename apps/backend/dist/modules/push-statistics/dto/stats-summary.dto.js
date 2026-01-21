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
exports.MessageHistoryItemDto = exports.StatsSummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class StatsSummaryDto {
}
exports.StatsSummaryDto = StatsSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total push messages sent' }),
    __metadata("design:type", Number)
], StatsSummaryDto.prototype, "totalShipments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total views across all messages' }),
    __metadata("design:type", Number)
], StatsSummaryDto.prototype, "totalViews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'View rate percentage' }),
    __metadata("design:type", String)
], StatsSummaryDto.prototype, "viewRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average click-through rate' }),
    __metadata("design:type", String)
], StatsSummaryDto.prototype, "averageCtr", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Change vs last period for shipments' }),
    __metadata("design:type", String)
], StatsSummaryDto.prototype, "shipmentsChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Change vs last period for views' }),
    __metadata("design:type", String)
], StatsSummaryDto.prototype, "viewsChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Change vs last period for view rate' }),
    __metadata("design:type", String)
], StatsSummaryDto.prototype, "viewRateChange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Change vs last period for CTR' }),
    __metadata("design:type", String)
], StatsSummaryDto.prototype, "ctrChange", void 0);
class MessageHistoryItemDto {
}
exports.MessageHistoryItemDto = MessageHistoryItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MessageHistoryItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MessageHistoryItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], MessageHistoryItemDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MessageHistoryItemDto.prototype, "target", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MessageHistoryItemDto.prototype, "totalSent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MessageHistoryItemDto.prototype, "totalViews", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MessageHistoryItemDto.prototype, "viewRate", void 0);
//# sourceMappingURL=stats-summary.dto.js.map