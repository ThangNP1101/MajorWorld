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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomMenuController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const bottom_menu_service_1 = require("./bottom-menu.service");
const bottom_menu_entity_1 = require("./entities/bottom-menu.entity");
const create_bottom_menu_dto_1 = require("./dto/create-bottom-menu.dto");
const update_bottom_menu_dto_1 = require("./dto/update-bottom-menu.dto");
const bulk_update_bottom_menu_dto_1 = require("./dto/bulk-update-bottom-menu.dto");
let BottomMenuController = class BottomMenuController {
    constructor(bottomMenuService) {
        this.bottomMenuService = bottomMenuService;
    }
    async findAll() {
        return this.bottomMenuService.findAll();
    }
    async findActive() {
        return this.bottomMenuService.findActive();
    }
    async findOne(id) {
        return this.bottomMenuService.findOne(id);
    }
    async create(createDto) {
        return this.bottomMenuService.create(createDto);
    }
    async bulkUpdate(bulkUpdateDto) {
        try {
            return await this.bottomMenuService.bulkUpdate(bulkUpdateDto);
        }
        catch (error) {
            console.error("Bulk update error:", error);
            throw error;
        }
    }
    async update(id, updateDto) {
        return this.bottomMenuService.update(id, updateDto);
    }
    async remove(id) {
        return this.bottomMenuService.remove(id);
    }
    async uploadActiveIcon(id, file) {
        return this.bottomMenuService.uploadActiveIcon(id, file);
    }
    async uploadInactiveIcon(id, file) {
        return this.bottomMenuService.uploadInactiveIcon(id, file);
    }
};
exports.BottomMenuController = BottomMenuController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all bottom menus" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "List of all menus",
        type: [bottom_menu_entity_1.BottomMenu],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BottomMenuController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("active"),
    (0, swagger_1.ApiOperation)({ summary: "Get active bottom menus only" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "List of active menus",
        type: [bottom_menu_entity_1.BottomMenu],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BottomMenuController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a menu by ID" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Menu found",
        type: bottom_menu_entity_1.BottomMenu,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Menu not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BottomMenuController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new menu" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Menu created successfully",
        type: bottom_menu_entity_1.BottomMenu,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bottom_menu_dto_1.CreateBottomMenuDto]),
    __metadata("design:returntype", Promise)
], BottomMenuController.prototype, "create", null);
__decorate([
    (0, common_1.Put)("bulk"),
    (0, swagger_1.ApiOperation)({ summary: "Bulk update all menus (replace all)" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Menus updated successfully",
        type: [bottom_menu_entity_1.BottomMenu],
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_update_bottom_menu_dto_1.BulkUpdateBottomMenuDto]),
    __metadata("design:returntype", Promise)
], BottomMenuController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a menu" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Menu updated successfully",
        type: bottom_menu_entity_1.BottomMenu,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Menu not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_bottom_menu_dto_1.UpdateBottomMenuDto]),
    __metadata("design:returntype", Promise)
], BottomMenuController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a menu" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: "Menu deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: "Menu not found" }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BottomMenuController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/upload/active-icon"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, swagger_1.ApiOperation)({ summary: "Upload active icon for a menu item" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Active icon uploaded successfully",
        type: bottom_menu_entity_1.BottomMenu,
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BottomMenuController.prototype, "uploadActiveIcon", null);
__decorate([
    (0, common_1.Post)(":id/upload/inactive-icon"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, swagger_1.ApiOperation)({ summary: "Upload inactive icon for a menu item" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Inactive icon uploaded successfully",
        type: bottom_menu_entity_1.BottomMenu,
    }),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BottomMenuController.prototype, "uploadInactiveIcon", null);
exports.BottomMenuController = BottomMenuController = __decorate([
    (0, swagger_1.ApiTags)("Admin - Bottom Menu"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("admin/bottom-menu"),
    __metadata("design:paramtypes", [bottom_menu_service_1.BottomMenuService])
], BottomMenuController);
//# sourceMappingURL=bottom-menu.controller.js.map