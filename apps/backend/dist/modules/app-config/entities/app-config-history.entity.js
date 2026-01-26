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
exports.AppConfigHistory = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let AppConfigHistory = class AppConfigHistory {
};
exports.AppConfigHistory = AppConfigHistory;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AppConfigHistory.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Key of the config this history entry belongs to" }),
    (0, typeorm_1.Column)({ name: "config_key", length: 50 }),
    __metadata("design:type", String)
], AppConfigHistory.prototype, "configKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Version number of the config" }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], AppConfigHistory.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Tab menu background color" }),
    (0, typeorm_1.Column)({ name: "tap_menu_bg", length: 7 }),
    __metadata("design:type", String)
], AppConfigHistory.prototype, "tapMenuBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Status bar background color" }),
    (0, typeorm_1.Column)({ name: "status_bar_bg", length: 7 }),
    __metadata("design:type", String)
], AppConfigHistory.prototype, "statusBarBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Title bar background color" }),
    (0, typeorm_1.Column)({ name: "title_bar_bg", length: 7 }),
    __metadata("design:type", String)
], AppConfigHistory.prototype, "titleBarBg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Tab menu text color" }),
    (0, typeorm_1.Column)({ name: "tap_menu_text_color", length: 7 }),
    __metadata("design:type", String)
], AppConfigHistory.prototype, "tapMenuTextColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Title text color" }),
    (0, typeorm_1.Column)({ name: "title_text_color", length: 7 }),
    __metadata("design:type", String)
], AppConfigHistory.prototype, "titleTextColor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], AppConfigHistory.prototype, "createdAt", void 0);
exports.AppConfigHistory = AppConfigHistory = __decorate([
    (0, typeorm_1.Entity)("app_config_history")
], AppConfigHistory);
//# sourceMappingURL=app-config-history.entity.js.map