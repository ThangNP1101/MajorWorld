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
exports.DeviceTokenController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const device_token_service_1 = require("./device-token.service");
const device_token_entity_1 = require("./entities/device-token.entity");
const create_device_token_dto_1 = require("./dto/create-device-token.dto");
let DeviceTokenController = class DeviceTokenController {
    constructor(deviceTokenService) {
        this.deviceTokenService = deviceTokenService;
    }
    async findAll() {
        return this.deviceTokenService.findAll();
    }
    async findOne(id) {
        return this.deviceTokenService.findOne(id);
    }
    async create(createDto) {
        return this.deviceTokenService.create(createDto);
    }
    async remove(id) {
        return this.deviceTokenService.remove(id);
    }
};
exports.DeviceTokenController = DeviceTokenController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all device tokens' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of device tokens',
        type: [device_token_entity_1.DeviceToken],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DeviceTokenController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a device token by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Device token found',
        type: device_token_entity_1.DeviceToken,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Device token not found'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeviceTokenController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a device token' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Device token created successfully',
        type: device_token_entity_1.DeviceToken,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_device_token_dto_1.CreateDeviceTokenDto]),
    __metadata("design:returntype", Promise)
], DeviceTokenController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a device token' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Device token deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Device token not found'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeviceTokenController.prototype, "remove", null);
exports.DeviceTokenController = DeviceTokenController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Device Tokens'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/device-tokens'),
    __metadata("design:paramtypes", [device_token_service_1.DeviceTokenService])
], DeviceTokenController);
//# sourceMappingURL=device-token.controller.js.map