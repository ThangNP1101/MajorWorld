"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDeviceTokenModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const test_device_token_entity_1 = require("./entities/test-device-token.entity");
const test_device_token_service_1 = require("./test-device-token.service");
const test_device_token_controller_1 = require("./test-device-token.controller");
let TestDeviceTokenModule = class TestDeviceTokenModule {
};
exports.TestDeviceTokenModule = TestDeviceTokenModule;
exports.TestDeviceTokenModule = TestDeviceTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([test_device_token_entity_1.TestDeviceToken])],
        providers: [test_device_token_service_1.TestDeviceTokenService],
        controllers: [test_device_token_controller_1.TestDeviceTokenController],
    })
], TestDeviceTokenModule);
//# sourceMappingURL=test-device-token.module.js.map