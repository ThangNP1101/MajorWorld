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
exports.PushMessageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const push_message_service_1 = require("./push-message.service");
const push_message_entity_1 = require("./entities/push-message.entity");
const create_push_message_dto_1 = require("./dto/create-push-message.dto");
const update_push_message_dto_1 = require("./dto/update-push-message.dto");
const send_test_push_dto_1 = require("./dto/send-test-push.dto");
const device_stats_dto_1 = require("./dto/device-stats.dto");
const upload_service_1 = require("../upload/upload.service");
let PushMessageController = class PushMessageController {
    constructor(pushMessageService, uploadService) {
        this.pushMessageService = pushMessageService;
        this.uploadService = uploadService;
    }
    async findAll() {
        return this.pushMessageService.findAll();
    }
    async findScheduled() {
        return this.pushMessageService.findScheduled();
    }
    async getDeviceStats() {
        return this.pushMessageService.getDeviceStats();
    }
    async findOne(id) {
        return this.pushMessageService.findOne(id);
    }
    async create(createDto) {
        return this.pushMessageService.create(createDto);
    }
    async update(id, updateDto) {
        return this.pushMessageService.update(id, updateDto);
    }
    async remove(id) {
        return this.pushMessageService.remove(id);
    }
    async send(id) {
        return this.pushMessageService.send(id);
    }
    async sendTest(id, sendTestDto) {
        return this.pushMessageService.sendTest(id, sendTestDto.deviceTokenIds);
    }
    async uploadImage(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const message = await this.pushMessageService.findOne(id);
        if (message.imageUrl) {
            await this.uploadService.deleteFile(message.imageUrl);
        }
        const imageUrl = await this.uploadService.uploadFile(file, 'push-messages/images');
        message.imageUrl = imageUrl;
        return this.pushMessageService.update(id, { imageUrl });
    }
};
exports.PushMessageController = PushMessageController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all push messages' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of all push messages',
        type: [push_message_entity_1.PushMessage],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PushMessageController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('scheduled'),
    (0, swagger_1.ApiOperation)({ summary: 'Get scheduled push messages' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of scheduled push messages',
        type: [push_message_entity_1.PushMessage],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PushMessageController.prototype, "findScheduled", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get device statistics by platform' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Device statistics',
        type: device_stats_dto_1.DeviceStatsDto,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PushMessageController.prototype, "getDeviceStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a push message by ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Push message found',
        type: push_message_entity_1.PushMessage,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Push message not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PushMessageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new push message' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Push message created successfully',
        type: push_message_entity_1.PushMessage,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_push_message_dto_1.CreatePushMessageDto]),
    __metadata("design:returntype", Promise)
], PushMessageController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a push message' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Push message updated successfully',
        type: push_message_entity_1.PushMessage,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Push message not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_push_message_dto_1.UpdatePushMessageDto]),
    __metadata("design:returntype", Promise)
], PushMessageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a push message' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Push message deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Push message not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PushMessageController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/send'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a push message immediately' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Push message sent successfully',
        type: push_message_entity_1.PushMessage,
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Push message not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PushMessageController.prototype, "send", null);
__decorate([
    (0, common_1.Post)(':id/test'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a test push to selected devices' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Test push sent successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Push message not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, send_test_push_dto_1.SendTestPushDto]),
    __metadata("design:returntype", Promise)
], PushMessageController.prototype, "sendTest", null);
__decorate([
    (0, common_1.Post)(':id/upload/image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload image for push notification' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Image uploaded successfully',
        type: push_message_entity_1.PushMessage,
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PushMessageController.prototype, "uploadImage", null);
exports.PushMessageController = PushMessageController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Push Messages'),
    (0, common_1.Controller)('admin/push-messages'),
    __metadata("design:paramtypes", [push_message_service_1.PushMessageService,
        upload_service_1.UploadService])
], PushMessageController);
//# sourceMappingURL=push-message.controller.js.map