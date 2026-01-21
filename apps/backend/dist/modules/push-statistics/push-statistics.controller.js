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
exports.PushStatisticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const push_statistics_service_1 = require("./push-statistics.service");
const track_event_dto_1 = require("./dto/track-event.dto");
const get_stats_query_dto_1 = require("./dto/get-stats-query.dto");
const stats_summary_dto_1 = require("./dto/stats-summary.dto");
const push_statistics_entity_1 = require("./entities/push-statistics.entity");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let PushStatisticsController = class PushStatisticsController {
    constructor(pushStatisticsService) {
        this.pushStatisticsService = pushStatisticsService;
    }
    async trackDelivered(dto) {
        return this.pushStatisticsService.trackEvent(dto, push_statistics_entity_1.EventType.DELIVERED);
    }
    async trackOpened(dto) {
        return this.pushStatisticsService.trackEvent(dto, push_statistics_entity_1.EventType.OPENED);
    }
    async trackClicked(dto) {
        return this.pushStatisticsService.trackEvent(dto, push_statistics_entity_1.EventType.CLICKED);
    }
    async getSummary(dto) {
        return this.pushStatisticsService.getSummary(dto);
    }
    async getHistory(dto) {
        return this.pushStatisticsService.getMessageHistory(dto);
    }
    async getMessageStats(id) {
        return this.pushStatisticsService.getMessageStats(id);
    }
};
exports.PushStatisticsController = PushStatisticsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('track/delivered'),
    (0, swagger_1.ApiOperation)({ summary: 'Track push notification delivery (called by mobile app)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Event tracked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_event_dto_1.TrackEventDto]),
    __metadata("design:returntype", Promise)
], PushStatisticsController.prototype, "trackDelivered", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('track/opened'),
    (0, swagger_1.ApiOperation)({ summary: 'Track push notification opened (called by mobile app)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Event tracked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_event_dto_1.TrackEventDto]),
    __metadata("design:returntype", Promise)
], PushStatisticsController.prototype, "trackOpened", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('track/clicked'),
    (0, swagger_1.ApiOperation)({ summary: 'Track push notification click (called by mobile app)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Event tracked successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_event_dto_1.TrackEventDto]),
    __metadata("design:returntype", Promise)
], PushStatisticsController.prototype, "trackClicked", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary statistics for dashboard cards' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: stats_summary_dto_1.StatsSummaryDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_stats_query_dto_1.GetStatsQueryDto]),
    __metadata("design:returntype", Promise)
], PushStatisticsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get push message history with statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns paginated list of sent messages with stats',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_stats_query_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], PushStatisticsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('message/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed statistics for a specific push message' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns detailed stats for the message',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PushStatisticsController.prototype, "getMessageStats", null);
exports.PushStatisticsController = PushStatisticsController = __decorate([
    (0, swagger_1.ApiTags)('Push Statistics'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('push-statistics'),
    __metadata("design:paramtypes", [push_statistics_service_1.PushStatisticsService])
], PushStatisticsController);
//# sourceMappingURL=push-statistics.controller.js.map