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
var PushScheduledProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushScheduledProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const push_message_service_1 = require("./push-message.service");
const push_message_queue_constants_1 = require("./push-message-queue.constants");
let PushScheduledProcessor = PushScheduledProcessor_1 = class PushScheduledProcessor {
    constructor(pushMessageService) {
        this.pushMessageService = pushMessageService;
        this.logger = new common_1.Logger(PushScheduledProcessor_1.name);
    }
    async executeScheduledSend(job) {
        const { messageId } = job.data;
        this.logger.debug(`Processing scheduled push message ${messageId}`);
        await this.pushMessageService.executeSendScheduledMessage({ messageId });
    }
};
exports.PushScheduledProcessor = PushScheduledProcessor;
__decorate([
    (0, bull_1.Process)(push_message_queue_constants_1.PUSH_MESSAGE_QUEUE.JOB.SEND_SCHEDULED),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PushScheduledProcessor.prototype, "executeScheduledSend", null);
exports.PushScheduledProcessor = PushScheduledProcessor = PushScheduledProcessor_1 = __decorate([
    (0, bull_1.Processor)(push_message_queue_constants_1.PUSH_MESSAGE_QUEUE.QUEUE_NAME),
    __metadata("design:paramtypes", [push_message_service_1.PushMessageService])
], PushScheduledProcessor);
//# sourceMappingURL=push-scheduled.processor.js.map