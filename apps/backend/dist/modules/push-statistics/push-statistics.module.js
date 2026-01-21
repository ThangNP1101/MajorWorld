"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushStatisticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const push_statistics_entity_1 = require("./entities/push-statistics.entity");
const push_message_entity_1 = require("../push-message/entities/push-message.entity");
const push_statistics_service_1 = require("./push-statistics.service");
const push_statistics_controller_1 = require("./push-statistics.controller");
const push_tracking_processor_1 = require("./push-tracking.processor");
const push_statistics_cron_1 = require("./push-statistics.cron");
const cache_module_1 = require("../../common/cache/cache.module");
let PushStatisticsModule = class PushStatisticsModule {
};
exports.PushStatisticsModule = PushStatisticsModule;
exports.PushStatisticsModule = PushStatisticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([push_statistics_entity_1.PushStatistics, push_message_entity_1.PushMessage]),
            bull_1.BullModule.registerQueue({
                name: push_tracking_processor_1.PUSH_TRACKING_QUEUE,
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
            cache_module_1.CacheModule,
        ],
        controllers: [push_statistics_controller_1.PushStatisticsController],
        providers: [push_statistics_service_1.PushStatisticsService, push_tracking_processor_1.PushTrackingProcessor, push_statistics_cron_1.PushStatisticsCron],
        exports: [push_statistics_service_1.PushStatisticsService],
    })
], PushStatisticsModule);
//# sourceMappingURL=push-statistics.module.js.map