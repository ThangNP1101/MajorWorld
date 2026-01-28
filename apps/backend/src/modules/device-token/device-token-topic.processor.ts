import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { DeviceTokenService } from './device-token.service';
import { DEVICE_TOKEN_QUEUE } from './constants/device-token-queue.constants';

interface SyncTokenJobData {
  tokenId: string;
}

interface SyncPendingJobData {}

/** Processes device token topic sync jobs. */
@Processor(DEVICE_TOKEN_QUEUE.QUEUE_NAME)
export class DeviceTokenTopicProcessor {
  private readonly logger = new Logger(DeviceTokenTopicProcessor.name);

  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  @Process(DEVICE_TOKEN_QUEUE.JOB.SYNC_TOKEN)
  /** Syncs a single token to topics. */
  async handleSyncToken(job: Job<SyncTokenJobData>): Promise<void> {
    this.logger.debug(`Syncing token ${job.data.tokenId}`);
    await this.deviceTokenService.syncTokenById({ tokenId: job.data.tokenId });
  }

  @Process(DEVICE_TOKEN_QUEUE.JOB.SYNC_PENDING)
  /** Syncs pending tokens in batch. */
  async handleSyncPending(job: Job<SyncPendingJobData>): Promise<void> {
    this.logger.debug(`Syncing pending tokens, job ${job.id}`);
    await this.deviceTokenService.syncPendingTokens();
  }
}
