"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepLinkModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const deep_link_entity_1 = require("./entities/deep-link.entity");
const deep_link_service_1 = require("./deep-link.service");
const deep_link_controller_1 = require("./deep-link.controller");
const deep_link_redirect_controller_1 = require("./deep-link-redirect.controller");
let DeepLinkModule = class DeepLinkModule {
};
exports.DeepLinkModule = DeepLinkModule;
exports.DeepLinkModule = DeepLinkModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([deep_link_entity_1.DeepLink])],
        controllers: [deep_link_controller_1.DeepLinkController, deep_link_redirect_controller_1.DeepLinkRedirectController],
        providers: [deep_link_service_1.DeepLinkService],
        exports: [deep_link_service_1.DeepLinkService],
    })
], DeepLinkModule);
//# sourceMappingURL=deep-link.module.js.map