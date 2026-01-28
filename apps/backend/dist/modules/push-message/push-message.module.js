"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushMessageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const push_message_entity_1 = require("./entities/push-message.entity");
const device_token_entity_1 = require("../device-token/entities/device-token.entity");
const test_device_token_entity_1 = require("../test-device-token/entities/test-device-token.entity");
const push_message_service_1 = require("./push-message.service");
const push_message_controller_1 = require("./push-message.controller");
const upload_module_1 = require("../upload/upload.module");
const push_scheduled_processor_1 = require("./push-scheduled.processor");
const push_message_queue_constants_1 = require("./push-message-queue.constants");
let PushMessageModule = class PushMessageModule {
};
exports.PushMessageModule = PushMessageModule;
exports.PushMessageModule = PushMessageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([push_message_entity_1.PushMessage, device_token_entity_1.DeviceToken, test_device_token_entity_1.TestDeviceToken]),
            bull_1.BullModule.registerQueue({
                name: push_message_queue_constants_1.PUSH_MESSAGE_QUEUE.QUEUE_NAME,
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 1000,
                    },
                    removeOnComplete: true,
                    removeOnFail: false,
                },
            }),
            upload_module_1.UploadModule,
        ],
        controllers: [push_message_controller_1.PushMessageController],
        providers: [push_message_service_1.PushMessageService, push_scheduled_processor_1.PushScheduledProcessor],
        exports: [push_message_service_1.PushMessageService],
    })
], PushMessageModule);
//# sourceMappingURL=push-message.module.js.map