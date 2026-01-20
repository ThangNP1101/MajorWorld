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
exports.CreateBottomMenuDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateBottomMenuDto {
}
exports.CreateBottomMenuDto = CreateBottomMenuDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Menu name', example: 'Home' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateBottomMenuDto.prototype, "menuName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Connection URL', example: '/' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateBottomMenuDto.prototype, "connectionUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active icon URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateBottomMenuDto.prototype, "iconActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Inactive icon URL', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateBottomMenuDto.prototype, "iconInactive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sort order', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBottomMenuDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Is menu active', example: true, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBottomMenuDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-bottom-menu.dto.js.map