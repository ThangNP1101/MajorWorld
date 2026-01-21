import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'bull';
import { PushStatistics, EventType } from './entities/push-statistics.entity';
import { PushMessage } from '../push-message/entities/push-message.entity';

export interface TrackingJobData {
  pushMessageId: number;
  deviceTokenId: string;
  eventType: EventType;
  timestamp: number;
}

export const PUSH_TRACKING_QUEUE = 'push-tracking';

@Processor(PUSH_TRACKING_QUEUE)
export class PushTrackingProcessor {
  private readonly logger = new Logger(PushTrackingProcessor.name);

  constructor(
    @InjectRepository(PushStatistics)
    private statsRepo: Repository<PushStatistics>,
    @InjectRepository(PushMessage)
    private messageRepo: Repository<PushMessage>,
  ) {}

  @Process('track')
  async handleTrack(job: Job<TrackingJobData>): Promise<void> {
    const { pushMessageId, deviceTokenId, eventType } = job.data;

    try {
      // Use INSERT ... ON CONFLICT DO NOTHING (upsert pattern)
      // This handles duplicates at DB level efficiently
      const result = await this.statsRepo
        .createQueryBuilder()
        .insert()
        .into(PushStatistics)
        .values({
          pushMessageId,
          deviceTokenId,
          eventType,
        })
        .orIgnore() // PostgreSQL: ON CONFLICT DO NOTHING
        .execute();

      // If a row was inserted (not a duplicate), update the counter
      if (result.raw?.length > 0 || result.identifiers?.length > 0) {
        if (eventType === EventType.OPENED) {
          await this.messageRepo
            .createQueryBuilder()
            .update()
            .set({ totalViews: () => 'total_views + 1' })
            .where('id = :id', { id: pushMessageId })
            .execute();
        }
      }
    } catch (error) {
      // If it's a unique constraint violation, it's a duplicate - ignore
      if (error.code === '23505') {
        this.logger.debug(
          `Duplicate event ignored: ${pushMessageId}:${deviceTokenId}:${eventType}`,
        );
        return;
      }
      throw error;
    }
  }

  @Process('batch-track')
  async handleBatchTrack(job: Job<{ events: TrackingJobData[] }>): Promise<void> {
    const { events } = job.data;
    if (events.length === 0) return;

    try {
      // Bulk insert with ON CONFLICT DO NOTHING
      await this.statsRepo
        .createQueryBuilder()
        .insert()
        .into(PushStatistics)
        .values(
          events.map((e) => ({
            pushMessageId: e.pushMessageId,
            deviceTokenId: e.deviceTokenId,
            eventType: e.eventType,
          })),
        )
        .orIgnore()
        .execute();

      // Aggregate opened events and update counters
      const openedCounts = new Map<number, number>();
      for (const event of events) {
        if (event.eventType === EventType.OPENED) {
          openedCounts.set(
            event.pushMessageId,
            (openedCounts.get(event.pushMessageId) || 0) + 1,
          );
        }
      }

      // Update counters for each message
      for (const [messageId, count] of openedCounts) {
        await this.messageRepo
          .createQueryBuilder()
          .update()
          .set({ totalViews: () => `total_views + ${count}` })
          .where('id = :id', { id: messageId })
          .execute();
      }

      this.logger.debug(`Batch processed ${events.length} events`);
    } catch (error) {
      this.logger.error(`Batch processing failed: ${error.message}`);
      throw error;
    }
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error): void {
    this.logger.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`,
    );
  }
}
