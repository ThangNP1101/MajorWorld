"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigVersionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cache_module_1 = require("../../common/cache/cache.module");
const config_version_entity_1 = require("./entities/config-version.entity");
const config_version_service_1 = require("./config-version.service");
const config_version_controller_1 = require("./config-version.controller");
let ConfigVersionModule = class ConfigVersionModule {
};
exports.ConfigVersionModule = ConfigVersionModule;
exports.ConfigVersionModule = ConfigVersionModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([config_version_entity_1.ConfigVersion]), cache_module_1.CacheModule],
        providers: [config_version_service_1.ConfigVersionService],
        controllers: [config_version_controller_1.ConfigVersionController],
        exports: [config_version_service_1.ConfigVersionService],
    })
], ConfigVersionModule);
//# sourceMappingURL=config-version.module.js.map