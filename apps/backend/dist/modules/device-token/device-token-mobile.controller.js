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
exports.DeviceTokenMobileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const device_token_service_1 = require("./device-token.service");
const register_device_token_dto_1 = require("./dto/register-device-token.dto");
const register_device_token_response_dto_1 = require("./dto/register-device-token-response.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let DeviceTokenMobileController = class DeviceTokenMobileController {
    constructor(deviceTokenService) {
        this.deviceTokenService = deviceTokenService;
    }
    async registerToken(registerDto) {
        const token = await this.deviceTokenService.registerToken(registerDto);
        return { success: true, deviceTokenId: token.id };
    }
};
exports.DeviceTokenMobileController = DeviceTokenMobileController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Register device token for push notifications',
        description: 'Register or update FCM token. Can be called with or without authentication.',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Device token registered successfully',
        type: register_device_token_response_dto_1.RegisterDeviceTokenResponseDto,
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_device_token_dto_1.RegisterDeviceTokenDto]),
    __metadata("design:returntype", Promise)
], DeviceTokenMobileController.prototype, "registerToken", null);
exports.DeviceTokenMobileController = DeviceTokenMobileController = __decorate([
    (0, swagger_1.ApiTags)('Mobile - Device Token'),
    (0, common_1.Controller)('v1/app/device-token'),
    __metadata("design:paramtypes", [device_token_service_1.DeviceTokenService])
], DeviceTokenMobileController);
//# sourceMappingURL=device-token-mobile.controller.js.map