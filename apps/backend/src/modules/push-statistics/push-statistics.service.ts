import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Repository, Between, In } from 'typeorm';
import { Queue } from 'bull';
import { Redis } from 'ioredis';
import { PushStatistics, EventType } from './entities/push-statistics.entity';
import { PushMessage, PushStatus } from '../push-message/entities/push-message.entity';
import { TrackEventDto } from './dto/track-event.dto';
import { GetStatsQueryDto, PaginationDto } from './dto/get-stats-query.dto';
import { StatsSummaryDto, MessageHistoryItemDto } from './dto/stats-summary.dto';
import { PUSH_TRACKING_QUEUE, TrackingJobData } from './push-tracking.processor';
import { REDIS_CLIENT } from '../../common/cache/cache.tokens';

// Redis key patterns
const REDIS_KEYS = {
  // Deduplication: push:dedup:{messageId}:{deviceId}:{eventType}
  dedup: (messageId: number, deviceId: string, eventType: string) =>
    `push:dedup:${messageId}:${deviceId}:${eventType}`,
  // Real-time counters: push:stats:{messageId}
  stats: (messageId: number) => `push:stats:${messageId}`,
  // Buffer for batch processing
  buffer: 'push:tracking:buffer',
};

// TTL for deduplication keys (7 days)
const DEDUP_TTL_SECONDS = 7 * 24 * 60 * 60;

// Batch size for buffer processing
const BATCH_SIZE = 100;

@Injectable()
export class PushStatisticsService {
  private readonly logger = new Logger(PushStatisticsService.name);

  constructor(
    @InjectRepository(PushStatistics)
    private statsRepo: Repository<PushStatistics>,
    @InjectRepository(PushMessage)
    private messageRepo: Repository<PushMessage>,
    @InjectQueue(PUSH_TRACKING_QUEUE)
    private trackingQueue: Queue<TrackingJobData>,
    @Inject(REDIS_CLIENT)
    private redis: Redis,
  ) {}

  /**
   * Track a push notification event using Redis + Queue
   * - Redis SETNX for instant deduplication
   * - Redis HINCRBY for real-time counters
   * - Bull queue for async DB persistence
   */
  async trackEvent(
    dto: TrackEventDto,
    eventType: EventType,
  ): Promise<{ success: boolean; queued?: boolean; duplicate?: boolean }> {
    const dedupKey = REDIS_KEYS.dedup(dto.pushMessageId, dto.deviceTokenId, eventType);

    try {
      // 1. Check deduplication with SETNX (atomic, returns 1 if key was set)
      const isNew = await this.redis.setnx(dedupKey, '1');
      
      if (!isNew) {
        // Already tracked - return immediately
        return { success: true, duplicate: true };
      }

      // 2. Set TTL for dedup key
      await this.redis.expire(dedupKey, DEDUP_TTL_SECONDS);

      // 3. Update real-time counter in Redis (for dashboard)
      if (eventType === EventType.OPENED) {
        await this.redis.hincrby(
          REDIS_KEYS.stats(dto.pushMessageId),
          'views',
          1,
        );
      } else if (eventType === EventType.DELIVERED) {
        await this.redis.hincrby(
          REDIS_KEYS.stats(dto.pushMessageId),
          'delivered',
          1,
        );
      } else if (eventType === EventType.CLICKED) {
        await this.redis.hincrby(
          REDIS_KEYS.stats(dto.pushMessageId),
          'clicked',
          1,
        );
      }

      // 4. Add to queue for DB persistence (async)
      await this.trackingQueue.add(
        'track',
        {
          pushMessageId: dto.pushMessageId,
          deviceTokenId: dto.deviceTokenId,
          eventType,
          timestamp: Date.now(),
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );

      return { success: true, queued: true };
    } catch (error) {
      this.logger.error(`Track event failed: ${error.message}`);
      
      // Fallback: try direct queue without Redis dedup
      try {
        await this.trackingQueue.add('track', {
          pushMessageId: dto.pushMessageId,
          deviceTokenId: dto.deviceTokenId,
          eventType,
          timestamp: Date.now(),
        });
        return { success: true, queued: true };
      } catch (queueError) {
        this.logger.error(`Queue fallback failed: ${queueError.message}`);
        return { success: false };
      }
    }
  }

  /**
   * Get summary statistics for the dashboard
   * Uses Redis for real-time data, falls back to DB
   */
  async getSummary(dto: GetStatsQueryDto): Promise<StatsSummaryDto> {
    const now = new Date();
    const endDate = dto.endDate ? new Date(dto.endDate) : now;
    const startDate = dto.startDate
      ? new Date(dto.startDate)
      : new Date(now.getFullYear(), now.getMonth(), 1);

    // Calculate the previous period for comparison
    const periodDuration = endDate.getTime() - startDate.getTime();
    const prevEndDate = new Date(startDate.getTime() - 1);
    const prevStartDate = new Date(prevEndDate.getTime() - periodDuration);

    // Current period stats
    const currentStats = await this.calculatePeriodStats(startDate, endDate);
    
    // Previous period stats for comparison
    const previousStats = await this.calculatePeriodStats(prevStartDate, prevEndDate);

    // Calculate changes
    const shipmentsChange = this.calculateChange(
      currentStats.totalShipments,
      previousStats.totalShipments,
    );
    const viewsChange = this.calculateChange(
      currentStats.totalViews,
      previousStats.totalViews,
    );
    const viewRateChange = this.calculateChange(
      parseFloat(currentStats.viewRate),
      parseFloat(previousStats.viewRate),
    );
    const ctrChange = this.calculateChange(
      parseFloat(currentStats.averageCtr),
      parseFloat(previousStats.averageCtr),
    );

    return {
      ...currentStats,
      shipmentsChange,
      viewsChange,
      viewRateChange,
      ctrChange,
    };
  }

  /**
   * Calculate stats for a specific period
   */
  private async calculatePeriodStats(
    startDate: Date,
    endDate: Date,
  ): Promise<StatsSummaryDto> {
    // Get all sent messages in the period
    const messages = await this.messageRepo.find({
      where: {
        status: PushStatus.SENT,
        sentAt: Between(startDate, endDate),
      },
    });

    let totalShipments = 0;
    let totalViews = 0;

    // Aggregate stats, checking Redis for real-time data
    for (const message of messages) {
      totalShipments += message.totalSent;
      
      // Try to get real-time views from Redis
      const redisViews = await this.redis.hget(
        REDIS_KEYS.stats(message.id),
        'views',
      );
      
      if (redisViews) {
        totalViews += parseInt(redisViews, 10);
      } else {
        totalViews += message.totalViews;
      }
    }

    // Calculate view rate
    const viewRate = totalShipments > 0
      ? ((totalViews / totalShipments) * 100).toFixed(1)
      : '0.0';

    // Calculate CTR (clicks / views)
    let totalClicks = 0;
    
    if (messages.length > 0) {
      // Try Redis first for real-time clicks
      for (const message of messages) {
        const redisClicks = await this.redis.hget(
          REDIS_KEYS.stats(message.id),
          'clicked',
        );
        if (redisClicks) {
          totalClicks += parseInt(redisClicks, 10);
        }
      }

      // If no Redis data, fall back to DB
      if (totalClicks === 0) {
        totalClicks = await this.statsRepo.count({
          where: {
            eventType: EventType.CLICKED,
            pushMessageId: In(messages.map(m => m.id)),
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

  /**
   * Calculate percentage change between two values
   */
  private calculateChange(current: number, previous: number): string {
    if (previous === 0) {
      return current > 0 ? '+100%' : '0%';
    }
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }

  /**
   * Get push message history with statistics
   */
  async getMessageHistory(dto: PaginationDto): Promise<{
    items: MessageHistoryItemDto[];
    total: number;
  }> {
    const [messages, total] = await this.messageRepo.findAndCount({
      where: { status: PushStatus.SENT },
      order: { sentAt: 'DESC' },
      take: dto.limit || 10,
      skip: dto.offset || 0,
    });

    const items: MessageHistoryItemDto[] = await Promise.all(
      messages.map(async (message) => {
        // Get real-time views from Redis if available
        let views = message.totalViews;
        const redisViews = await this.redis.hget(
          REDIS_KEYS.stats(message.id),
          'views',
        );
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
          viewRate:
            message.totalSent > 0
              ? `${((views / message.totalSent) * 100).toFixed(1)}%`
              : '0.0%',
        };
      }),
    );

    return { items, total };
  }

  /**
   * Get detailed statistics for a specific push message
   */
  async getMessageStats(messageId: number): Promise<{
    delivered: number;
    opened: number;
    clicked: number;
    deliveryRate: string;
    openRate: string;
    clickRate: string;
  }> {
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

    // Try Redis first for real-time stats
    const redisStats = await this.redis.hgetall(REDIS_KEYS.stats(messageId));
    
    let delivered = parseInt(redisStats.delivered || '0', 10);
    let opened = parseInt(redisStats.views || '0', 10);
    let clicked = parseInt(redisStats.clicked || '0', 10);

    // Fall back to DB if no Redis data
    if (!redisStats.delivered && !redisStats.views && !redisStats.clicked) {
      [delivered, opened, clicked] = await Promise.all([
        this.statsRepo.count({
          where: { pushMessageId: messageId, eventType: EventType.DELIVERED },
        }),
        this.statsRepo.count({
          where: { pushMessageId: messageId, eventType: EventType.OPENED },
        }),
        this.statsRepo.count({
          where: { pushMessageId: messageId, eventType: EventType.CLICKED },
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

  /**
   * Sync Redis counters to database (called by cron job)
   * This ensures data persistence and keeps DB in sync
   */
  async syncRedisToDatabase(): Promise<void> {
    this.logger.log('Starting Redis to DB sync...');
    
    try {
      // Find all stats keys in Redis
      const keys = await this.redis.keys('push:stats:*');
      
      for (const key of keys) {
        const messageId = parseInt(key.split(':')[2], 10);
        const stats = await this.redis.hgetall(key);
        
        if (stats.views) {
          const views = parseInt(stats.views, 10);
          
          // Get current DB value
          const message = await this.messageRepo.findOne({
            where: { id: messageId },
          });
          
          if (message && views > message.totalViews) {
            // Update DB with Redis value (Redis is source of truth for real-time)
            await this.messageRepo.update(messageId, {
              totalViews: views,
            });
          }
        }
      }
      
      this.logger.log(`Synced ${keys.length} message stats to database`);
    } catch (error) {
      this.logger.error(`Redis to DB sync failed: ${error.message}`);
    }
  }
}
