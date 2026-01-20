"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomMenuModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bottom_menu_entity_1 = require("./entities/bottom-menu.entity");
const bottom_menu_service_1 = require("./bottom-menu.service");
const bottom_menu_controller_1 = require("./bottom-menu.controller");
const upload_module_1 = require("../upload/upload.module");
const cache_module_1 = require("../../common/cache/cache.module");
let BottomMenuModule = class BottomMenuModule {
};
exports.BottomMenuModule = BottomMenuModule;
exports.BottomMenuModule = BottomMenuModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([bottom_menu_entity_1.BottomMenu]), upload_module_1.UploadModule, cache_module_1.CacheModule],
        controllers: [bottom_menu_controller_1.BottomMenuController],
        providers: [bottom_menu_service_1.BottomMenuService],
        exports: [bottom_menu_service_1.BottomMenuService],
    })
], BottomMenuModule);
//# sourceMappingURL=bottom-menu.module.js.map