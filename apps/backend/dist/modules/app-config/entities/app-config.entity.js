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
exports.AppConfig = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let AppConfig = class AppConfig {
};
exports.AppConfig = AppConfig;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryColumn)({ type: "varchar", length: 50, default: "default" }),
    __metadata("design:type", String)
], AppConfig.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], AppConfig.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Tab menu background color", example: "#9f7575" }),
    (0, typeorm_1.Column)({ name: "tap_menu_bg", length: 7, default: "#FFFFFF" }),
    __metadata("design:type", String)
], AppConfig.prototype, "tapMenuBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Status bar background color",
        example: "#000000",
    }),
    (0, typeorm_1.Column)({ name: "status_bar_bg", length: 7, default: "#000000" }),
    __metadata("design:type", String)
], AppConfig.prototype, "statusBarBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Title bar background color",
        example: "#FFFFFF",
    }),
    (0, typeorm_1.Column)({ name: "title_bar_bg", length: 7, default: "#FFFFFF" }),
    __metadata("design:type", String)
], AppConfig.prototype, "titleBarBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], AppConfig.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], AppConfig.prototype, "updatedAt", void 0);
exports.AppConfig = AppConfig = __decorate([
    (0, typeorm_1.Entity)("app_configs")
], AppConfig);
//# sourceMappingURL=app-config.entity.js.map