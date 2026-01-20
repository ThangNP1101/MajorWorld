"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFeaturesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const app_features_entity_1 = require("./entities/app-features.entity");
const app_features_controller_1 = require("./app-features.controller");
const app_features_service_1 = require("./app-features.service");
const upload_module_1 = require("../upload/upload.module");
let AppFeaturesModule = class AppFeaturesModule {
};
exports.AppFeaturesModule = AppFeaturesModule;
exports.AppFeaturesModule = AppFeaturesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([app_features_entity_1.AppFeatures]), upload_module_1.UploadModule],
        controllers: [app_features_controller_1.AppFeaturesController],
        providers: [app_features_service_1.AppFeaturesService],
        exports: [app_features_service_1.AppFeaturesService],
    })
], AppFeaturesModule);
//# sourceMappingURL=app-features.module.js.map