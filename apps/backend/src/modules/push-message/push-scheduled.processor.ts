import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PushMessageService } from './push-message.service';
import { PUSH_MESSAGE_QUEUE } from './push-message-queue.constants';

interface ScheduledPushJobData {
  messageId: number;
}

/**
 * Handles delayed push message sending jobs.
 */
@Processor(PUSH_MESSAGE_QUEUE.QUEUE_NAME)
export class PushScheduledProcessor {
  private readonly logger = new Logger(PushScheduledProcessor.name);

  constructor(private readonly pushMessageService: PushMessageService) {}

  /**
   * Executes a scheduled push message job.
   */
  @Process(PUSH_MESSAGE_QUEUE.JOB.SEND_SCHEDULED)
  async executeScheduledSend(job: Job<ScheduledPushJobData>): Promise<void> {
    const { messageId } = job.data;
    this.logger.debug(`Processing scheduled push message ${messageId}`);
    await this.pushMessageService.executeSendScheduledMessage({ messageId });
  }
}
