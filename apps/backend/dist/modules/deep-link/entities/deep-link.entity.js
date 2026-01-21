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
exports.DeepLink = exports.ConnectivityType = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
var ConnectivityType;
(function (ConnectivityType) {
    ConnectivityType["STORE_ONLY"] = "store_only";
    ConnectivityType["APP_OR_STORE"] = "app_or_store";
    ConnectivityType["APP_OR_WEB"] = "app_or_web";
})(ConnectivityType || (exports.ConnectivityType = ConnectivityType = {}));
let DeepLink = class DeepLink {
};
exports.DeepLink = DeepLink;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeepLink.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original web URL' }),
    (0, typeorm_1.Column)({ name: 'original_url', length: 2048 }),
    __metadata("design:type", String)
], DeepLink.prototype, "originalUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ConnectivityType }),
    (0, typeorm_1.Column)({
        name: 'connectivity_type',
        type: 'enum',
        enum: ConnectivityType,
        enumName: 'deep_links_connectivity_type_enum',
    }),
    __metadata("design:type", String)
], DeepLink.prototype, "connectivityType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'short_code', length: 16 }),
    __metadata("design:type", String)
], DeepLink.prototype, "shortCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], DeepLink.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], DeepLink.prototype, "updatedAt", void 0);
exports.DeepLink = DeepLink = __decorate([
    (0, typeorm_1.Entity)('deep_links')
], DeepLink);
//# sourceMappingURL=deep-link.entity.js.map