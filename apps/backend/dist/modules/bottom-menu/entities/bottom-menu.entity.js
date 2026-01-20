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
exports.BottomMenu = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let BottomMenu = class BottomMenu {
};
exports.BottomMenu = BottomMenu;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BottomMenu.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Menu name', example: 'Home' }),
    (0, typeorm_1.Column)({ name: 'menu_name', length: 50 }),
    __metadata("design:type", String)
], BottomMenu.prototype, "menuName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Connection URL', example: '/' }),
    (0, typeorm_1.Column)({ name: 'connection_url', length: 255 }),
    __metadata("design:type", String)
], BottomMenu.prototype, "connectionUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active icon URL' }),
    (0, typeorm_1.Column)({ name: 'icon_active', length: 255, nullable: true }),
    __metadata("design:type", String)
], BottomMenu.prototype, "iconActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Inactive icon URL' }),
    (0, typeorm_1.Column)({ name: 'icon_inactive', length: 255, nullable: true }),
    __metadata("design:type", String)
], BottomMenu.prototype, "iconInactive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sort order for menu display' }),
    (0, typeorm_1.Column)({ name: 'sort_order', default: 0 }),
    __metadata("design:type", Number)
], BottomMenu.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is menu active' }),
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], BottomMenu.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], BottomMenu.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], BottomMenu.prototype, "updatedAt", void 0);
exports.BottomMenu = BottomMenu = __decorate([
    (0, typeorm_1.Entity)('bottom_menus')
], BottomMenu);
//# sourceMappingURL=bottom-menu.entity.js.map