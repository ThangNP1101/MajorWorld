"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTokenModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const device_token_entity_1 = require("./entities/device-token.entity");
const device_token_service_1 = require("./device-token.service");
const device_token_controller_1 = require("./device-token.controller");
const device_token_mobile_controller_1 = require("./device-token-mobile.controller");
const device_token_topic_processor_1 = require("./device-token-topic.processor");
const device_token_queue_constants_1 = require("./constants/device-token-queue.constants");
let DeviceTokenModule = class DeviceTokenModule {
};
exports.DeviceTokenModule = DeviceTokenModule;
exports.DeviceTokenModule = DeviceTokenModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([device_token_entity_1.DeviceToken]),
            bull_1.BullModule.registerQueue({
                name: device_token_queue_constants_1.DEVICE_TOKEN_QUEUE.QUEUE_NAME,
                defaultJobOptions: {
                    attempts: 3,
                    backoff: { type: 'exponential', delay: 1000 },
                    removeOnComplete: true,
                    removeOnFail: false,
                },
            }),
        ],
        providers: [device_token_service_1.DeviceTokenService, device_token_topic_processor_1.DeviceTokenTopicProcessor],
        controllers: [device_token_controller_1.DeviceTokenController, device_token_mobile_controller_1.DeviceTokenMobileController],
        exports: [device_token_service_1.DeviceTokenService],
    })
], DeviceTokenModule);
//# sourceMappingURL=device-token.module.js.map