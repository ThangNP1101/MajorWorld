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
exports.TestDeviceTokenController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const test_device_token_service_1 = require("./test-device-token.service");
const test_device_token_entity_1 = require("./entities/test-device-token.entity");
const create_test_device_token_dto_1 = require("./dto/create-test-device-token.dto");
let TestDeviceTokenController = class TestDeviceTokenController {
    constructor(testDeviceTokenService) {
        this.testDeviceTokenService = testDeviceTokenService;
    }
    async findAll() {
        return this.testDeviceTokenService.findAll();
    }
    async findOne(id) {
        return this.testDeviceTokenService.findOne(id);
    }
    async create(createDto) {
        return this.testDeviceTokenService.create(createDto);
    }
    async remove(id) {
        return this.testDeviceTokenService.remove(id);
    }
};
exports.TestDeviceTokenController = TestDeviceTokenController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all test device tokens' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of test device tokens',
        type: [test_device_token_entity_1.TestDeviceToken],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestDeviceTokenController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a test device token by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Test device token found',
        type: test_device_token_entity_1.TestDeviceToken,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Test device token not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestDeviceTokenController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a test device token' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Test device token created successfully',
        type: test_device_token_entity_1.TestDeviceToken,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_test_device_token_dto_1.CreateTestDeviceTokenDto]),
    __metadata("design:returntype", Promise)
], TestDeviceTokenController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a test device token' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Test device token deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Test device token not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestDeviceTokenController.prototype, "remove", null);
exports.TestDeviceTokenController = TestDeviceTokenController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Test Device Tokens'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/test-device-tokens'),
    __metadata("design:paramtypes", [test_device_token_service_1.TestDeviceTokenService])
], TestDeviceTokenController);
//# sourceMappingURL=test-device-token.controller.js.map