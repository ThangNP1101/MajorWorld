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
exports.DeviceStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DeviceStatsDto {
}
exports.DeviceStatsDto = DeviceStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total active devices', example: 15234 }),
    __metadata("design:type", Number)
], DeviceStatsDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active Android devices', example: 9876 }),
    __metadata("design:type", Number)
], DeviceStatsDto.prototype, "android", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active iOS devices', example: 5358 }),
    __metadata("design:type", Number)
], DeviceStatsDto.prototype, "ios", void 0);
//# sourceMappingURL=device-stats.dto.js.map