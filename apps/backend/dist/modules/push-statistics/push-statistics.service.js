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
var PushStatisticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushStatisticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const typeorm_2 = require("typeorm");
const ioredis_1 = require("ioredis");
const push_statistics_entity_1 = require("./entities/push-statistics.entity");
const push_message_entity_1 = require("../push-message/entities/push-message.entity");
const push_tracking_processor_1 = require("./push-tracking.processor");
const cache_tokens_1 = require("../../common/cache/cache.tokens");
const REDIS_KEYS = {
    dedup: (messageId, deviceId, eventType) => `push:dedup:${messageId}:${deviceId}:${eventType}`,
    stats: (messageId) => `push:stats:${messageId}`,
    buffer: 'push:tracking:buffer',
};
const DEDUP_TTL_SECONDS = 7 * 24 * 60 * 60;
const BATCH_SIZE = 100;
let PushStatisticsService = PushStatisticsService_1 = class PushStatisticsService {
    constructor(statsRepo, messageRepo, trackingQueue, redis) {
        this.statsRepo = statsRepo;
        this.messageRepo = messageRepo;
        this.trackingQueue = trackingQueue;
        this.redis = redis;
        this.logger = new common_1.Logger(PushStatisticsService_1.name);
    }
    async trackEvent(dto, eventType) {
        const dedupKey = REDIS_KEYS.dedup(dto.pushMessageId, dto.deviceTokenId, eventType);
        try {
            const isNew = await this.redis.setnx(dedupKey, '1');
            if (!isNew) {
                return { success: true, duplicate: true };
            }
            await this.redis.expire(dedupKey, DEDUP_TTL_SECONDS);
            if (eventType === push_statistics_entity_1.EventType.OPENED) {
                await this.redis.hincrby(REDIS_KEYS.stats(dto.pushMessageId), 'views', 1);
            }
            else if (eventType === push_statistics_entity_1.EventType.DELIVERED) {
                await this.redis.hincrby(REDIS_KEYS.stats(dto.pushMessageId), 'delivered', 1);
            }
            else if (eventType === push_statistics_entity_1.EventType.CLICKED) {
                await this.redis.hincrby(REDIS_KEYS.stats(dto.pushMessageId), 'clicked', 1);
            }
            await this.trackingQueue.add('track', {
                pushMessageId: dto.pushMessageId,
                deviceTokenId: dto.deviceTokenId,
                eventType,
                timestamp: Date.now(),
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: true,
                removeOnFail: false,
            });
            return { success: true, queued: true };
        }
        catch (error) {
            this.logger.error(`Track event failed: ${error.message}`);
            try {
                await this.trackingQueue.add('track', {
                    pushMessageId: dto.pushMessageId,
                    deviceTokenId: dto.deviceTokenId,
                    eventType,
                    timestamp: Date.now(),
                });
                return { success: true, queued: true };
            }
            catch (queueError) {
                this.logger.error(`Queue fallback failed: ${queueError.message}`);
                return { success: false };
            }
        }
    }
    async getSummary(dto) {
        const now = new Date();
        const endDate = dto.endDate ? new Date(dto.endDate) : now;
        const startDate = dto.startDate
            ? new Date(dto.startDate)
            : new Date(now.getFullYear(), now.getMonth(), 1);
        const periodDuration = endDate.getTime() - startDate.getTime();
        const prevEndDate = new Date(startDate.getTime() - 1);
        const prevStartDate = new Date(prevEndDate.getTime() - periodDuration);
        const currentStats = await this.calculatePeriodStats(startDate, endDate);
        const previousStats = await this.calculatePeriodStats(prevStartDate, prevEndDate);
        const shipmentsChange = this.calculateChange(currentStats.totalShipments, previousStats.totalShipments);
        const viewsChange = this.calculateChange(currentStats.totalViews, previousStats.totalViews);
        const viewRateChange = this.calculateChange(parseFloat(currentStats.viewRate), parseFloat(previousStats.viewRate));
        const ctrChange = this.calculateChange(parseFloat(currentStats.averageCtr), parseFloat(previousStats.averageCtr));
        return {
            ...currentStats,
            shipmentsChange,
            viewsChange,
            viewRateChange,
            ctrChange,
        };
    }
    async calculatePeriodStats(startDate, endDate) {
        const messages = await this.messageRepo.find({
            where: {
                status: push_message_entity_1.PushStatus.SENT,
                sentAt: (0, typeorm_2.Between)(startDate, endDate),
            },
        });
        let totalShipments = 0;
        let totalViews = 0;
        for (const message of messages) {
            totalShipments += message.totalSent;
            const redisViews = await this.redis.hget(REDIS_KEYS.stats(message.id), 'views');
            if (redisViews) {
                totalViews += parseInt(redisViews, 10);
            }
            else {
                totalViews += message.totalViews;
            }
        }
        const viewRate = totalShipments > 0
            ? ((totalViews / totalShipments) * 100).toFixed(1)
            : '0.0';
        let totalClicks = 0;
        if (messages.length > 0) {
            for (const message of messages) {
                const redisClicks = await this.redis.hget(REDIS_KEYS.stats(message.id), 'clicked');
                if (redisClicks) {
                    totalClicks += parseInt(redisClicks, 10);
                }
            }
            if (totalClicks === 0) {
                totalClicks = await this.statsRepo.count({
                    where: {
                        eventType: push_statistics_entity_1.EventType.CLICKED,
                        pushMessageId: (0, typeorm_2.In)(messages.map(m => m.id)),
                    },
                });
            }
        }
        const averageCtr = totalViews > 0
            ? ((totalClicks / totalViews) * 100).toFixed(1)
            : '0.0';
        return {
            totalShipments,
            totalViews,
            viewRate: `${viewRate}%`,
            averageCtr: `${averageCtr}%`,
        };
    }
    calculateChange(current, previous) {
        if (previous === 0) {
            return current > 0 ? '+100%' : '0%';
        }
        const change = ((current - previous) / previous) * 100;
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(1)}%`;
    }
    async getMessageHistory(dto) {
        const [messages, total] = await this.messageRepo.findAndCount({
            where: { status: push_message_entity_1.PushStatus.SENT },
            order: { sentAt: 'DESC' },
            take: dto.limit || 10,
            skip: dto.offset || 0,
        });
        const items = await Promise.all(messages.map(async (message) => {
            let views = message.totalViews;
            const redisViews = await this.redis.hget(REDIS_KEYS.stats(message.id), 'views');
            if (redisViews) {
                views = parseInt(redisViews, 10);
            }
            return {
                id: message.id,
                title: message.title,
                sentAt: message.sentAt,
                target: message.target,
                totalSent: message.totalSent,
                totalViews: views,
                viewRate: message.totalSent > 0
                    ? `${((views / message.totalSent) * 100).toFixed(1)}%`
                    : '0.0%',
            };
        }));
        return { items, total };
    }
    async getMessageStats(messageId) {
        const message = await this.messageRepo.findOne({
            where: { id: messageId },
        });
        if (!message) {
            return {
                delivered: 0,
                opened: 0,
                clicked: 0,
                deliveryRate: '0.0%',
                openRate: '0.0%',
                clickRate: '0.0%',
            };
        }
        const redisStats = await this.redis.hgetall(REDIS_KEYS.stats(messageId));
        let delivered = parseInt(redisStats.delivered || '0', 10);
        let opened = parseInt(redisStats.views || '0', 10);
        let clicked = parseInt(redisStats.clicked || '0', 10);
        if (!redisStats.delivered && !redisStats.views && !redisStats.clicked) {
            [delivered, opened, clicked] = await Promise.all([
                this.statsRepo.count({
                    where: { pushMessageId: messageId, eventType: push_statistics_entity_1.EventType.DELIVERED },
                }),
                this.statsRepo.count({
                    where: { pushMessageId: messageId, eventType: push_statistics_entity_1.EventType.OPENED },
                }),
                this.statsRepo.count({
                    where: { pushMessageId: messageId, eventType: push_statistics_entity_1.EventType.CLICKED },
                }),
            ]);
        }
        const totalSent = message.totalSent || 1;
        return {
            delivered,
            opened,
            clicked,
            deliveryRate: `${((delivered / totalSent) * 100).toFixed(1)}%`,
            openRate: `${((opened / totalSent) * 100).toFixed(1)}%`,
            clickRate: opened > 0 ? `${((clicked / opened) * 100).toFixed(1)}%` : '0.0%',
        };
    }
    async syncRedisToDatabase() {
        this.logger.log('Starting Redis to DB sync...');
        try {
            const keys = await this.redis.keys('push:stats:*');
            for (const key of keys) {
                const messageId = parseInt(key.split(':')[2], 10);
                const stats = await this.redis.hgetall(key);
                if (stats.views) {
                    const views = parseInt(stats.views, 10);
                    const message = await this.messageRepo.findOne({
                        where: { id: messageId },
                    });
                    if (message && views > message.totalViews) {
                        await this.messageRepo.update(messageId, {
                            totalViews: views,
                        });
                    }
                }
            }
            this.logger.log(`Synced ${keys.length} message stats to database`);
        }
        catch (error) {
            this.logger.error(`Redis to DB sync failed: ${error.message}`);
        }
    }
};
exports.PushStatisticsService = PushStatisticsService;
exports.PushStatisticsService = PushStatisticsService = PushStatisticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(push_statistics_entity_1.PushStatistics)),
    __param(1, (0, typeorm_1.InjectRepository)(push_message_entity_1.PushMessage)),
    __param(2, (0, bull_1.InjectQueue)(push_tracking_processor_1.PUSH_TRACKING_QUEUE)),
    __param(3, (0, common_1.Inject)(cache_tokens_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object, ioredis_1.Redis])
], PushStatisticsService);
//# sourceMappingURL=push-statistics.service.js.map