import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PushStatisticsService } from './push-statistics.service';
import { TrackEventDto } from './dto/track-event.dto';
import { GetStatsQueryDto, PaginationDto } from './dto/get-stats-query.dto';
import { StatsSummaryDto, MessageHistoryItemDto } from './dto/stats-summary.dto';
import { EventType } from './entities/push-statistics.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Push Statistics')
@Controller('push-statistics')
export class PushStatisticsController {
  constructor(private readonly pushStatisticsService: PushStatisticsService) {}

  // ==================== Mobile App Tracking Endpoints ====================
  // These endpoints are public - called by mobile apps

  @Public()
  @Post('track/delivered')
  @ApiOperation({ summary: 'Track push notification delivery (called by mobile app)' })
  @ApiResponse({ status: 201, description: 'Event tracked successfully' })
  async trackDelivered(@Body() dto: TrackEventDto) {
    return this.pushStatisticsService.trackEvent(dto, EventType.DELIVERED);
  }

  @Public()
  @Post('track/opened')
  @ApiOperation({ summary: 'Track push notification opened (called by mobile app)' })
  @ApiResponse({ status: 201, description: 'Event tracked successfully' })
  async trackOpened(@Body() dto: TrackEventDto) {
    return this.pushStatisticsService.trackEvent(dto, EventType.OPENED);
  }

  @Public()
  @Post('track/clicked')
  @ApiOperation({ summary: 'Track push notification click (called by mobile app)' })
  @ApiResponse({ status: 201, description: 'Event tracked successfully' })
  async trackClicked(@Body() dto: TrackEventDto) {
    return this.pushStatisticsService.trackEvent(dto, EventType.CLICKED);
  }

  // ==================== Admin Dashboard Endpoints ====================

  @Get('summary')
  @ApiOperation({ summary: 'Get summary statistics for dashboard cards' })
  @ApiResponse({ status: 200, type: StatsSummaryDto })
  async getSummary(@Query() dto: GetStatsQueryDto): Promise<StatsSummaryDto> {
    return this.pushStatisticsService.getSummary(dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get push message history with statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of sent messages with stats',
  })
  async getHistory(@Query() dto: PaginationDto): Promise<{
    items: MessageHistoryItemDto[];
    total: number;
  }> {
    return this.pushStatisticsService.getMessageHistory(dto);
  }

  @Get('message/:id')
  @ApiOperation({ summary: 'Get detailed statistics for a specific push message' })
  @ApiResponse({
    status: 200,
    description: 'Returns detailed stats for the message',
  })
  async getMessageStats(@Param('id', ParseIntPipe) id: number) {
    return this.pushStatisticsService.getMessageStats(id);
  }
}
