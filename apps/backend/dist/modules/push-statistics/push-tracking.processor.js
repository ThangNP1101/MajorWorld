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
var PushTrackingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushTrackingProcessor = exports.PUSH_TRACKING_QUEUE = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const push_statistics_entity_1 = require("./entities/push-statistics.entity");
const push_message_entity_1 = require("../push-message/entities/push-message.entity");
exports.PUSH_TRACKING_QUEUE = 'push-tracking';
let PushTrackingProcessor = PushTrackingProcessor_1 = class PushTrackingProcessor {
    constructor(statsRepo, messageRepo) {
        this.statsRepo = statsRepo;
        this.messageRepo = messageRepo;
        this.logger = new common_1.Logger(PushTrackingProcessor_1.name);
    }
    async handleTrack(job) {
        const { pushMessageId, deviceTokenId, eventType } = job.data;
        try {
            const result = await this.statsRepo
                .createQueryBuilder()
                .insert()
                .into(push_statistics_entity_1.PushStatistics)
                .values({
                pushMessageId,
                deviceTokenId,
                eventType,
            })
                .orIgnore()
                .execute();
            if (result.raw?.length > 0 || result.identifiers?.length > 0) {
                if (eventType === push_statistics_entity_1.EventType.OPENED) {
                    await this.messageRepo
                        .createQueryBuilder()
                        .update()
                        .set({ totalViews: () => 'total_views + 1' })
                        .where('id = :id', { id: pushMessageId })
                        .execute();
                }
            }
        }
        catch (error) {
            if (error.code === '23505') {
                this.logger.debug(`Duplicate event ignored: ${pushMessageId}:${deviceTokenId}:${eventType}`);
                return;
            }
            throw error;
        }
    }
    async handleBatchTrack(job) {
        const { events } = job.data;
        if (events.length === 0)
            return;
        try {
            await this.statsRepo
                .createQueryBuilder()
                .insert()
                .into(push_statistics_entity_1.PushStatistics)
                .values(events.map((e) => ({
                pushMessageId: e.pushMessageId,
                deviceTokenId: e.deviceTokenId,
                eventType: e.eventType,
            })))
                .orIgnore()
                .execute();
            const openedCounts = new Map();
            for (const event of events) {
                if (event.eventType === push_statistics_entity_1.EventType.OPENED) {
                    openedCounts.set(event.pushMessageId, (openedCounts.get(event.pushMessageId) || 0) + 1);
                }
            }
            for (const [messageId, count] of openedCounts) {
                await this.messageRepo
                    .createQueryBuilder()
                    .update()
                    .set({ totalViews: () => `total_views + ${count}` })
                    .where('id = :id', { id: messageId })
                    .execute();
            }
            this.logger.debug(`Batch processed ${events.length} events`);
        }
        catch (error) {
            this.logger.error(`Batch processing failed: ${error.message}`);
            throw error;
        }
    }
    onFailed(job, error) {
        this.logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`);
    }
};
exports.PushTrackingProcessor = PushTrackingProcessor;
__decorate([
    (0, bull_1.Process)('track'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PushTrackingProcessor.prototype, "handleTrack", null);
__decorate([
    (0, bull_1.Process)('batch-track'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PushTrackingProcessor.prototype, "handleBatchTrack", null);
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], PushTrackingProcessor.prototype, "onFailed", null);
exports.PushTrackingProcessor = PushTrackingProcessor = PushTrackingProcessor_1 = __decorate([
    (0, bull_1.Processor)(exports.PUSH_TRACKING_QUEUE),
    __param(0, (0, typeorm_1.InjectRepository)(push_statistics_entity_1.PushStatistics)),
    __param(1, (0, typeorm_1.InjectRepository)(push_message_entity_1.PushMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PushTrackingProcessor);
//# sourceMappingURL=push-tracking.processor.js.map