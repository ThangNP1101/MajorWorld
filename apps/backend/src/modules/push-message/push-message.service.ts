import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In, FindOptionsWhere } from 'typeorm';
import { Queue } from 'bull';
import { PushMessage, PushStatus, PushTarget, SendType } from './entities/push-message.entity';
import { CreatePushMessageDto } from './dto/create-push-message.dto';
import { UpdatePushMessageDto } from './dto/update-push-message.dto';
import { DeviceToken, Platform } from '../device-token/entities/device-token.entity';
import { TestDeviceToken } from '../test-device-token/entities/test-device-token.entity';
import { DeviceStatsDto } from './dto/device-stats.dto';
import { PUSH_MESSAGE_QUEUE } from './push-message-queue.constants';
import { DEVICE_TOKEN_TOPICS } from '../device-token/constants/device-token-topics.constants';
import * as admin from 'firebase-admin';

interface ScheduledPushJobData {
  messageId: number;
}

@Injectable()
export class PushMessageService {
  constructor(
    @InjectRepository(PushMessage)
    private pushMessageRepository: Repository<PushMessage>,
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
    @InjectRepository(TestDeviceToken)
    private testDeviceTokenRepository: Repository<TestDeviceToken>,
    @InjectQueue(PUSH_MESSAGE_QUEUE.QUEUE_NAME)
    private scheduledQueue: Queue<ScheduledPushJobData>,
  ) {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      } catch (error) {
        console.warn('Firebase Admin initialization failed:', error.message);
      }
    }
  }

  async findAll(): Promise<PushMessage[]> {
    return this.pushMessageRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findScheduled(): Promise<PushMessage[]> {
    return this.pushMessageRepository.find({
      where: {
        status: PushStatus.SCHEDULED,
        sendType: SendType.SCHEDULED,
      },
      order: { scheduledAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PushMessage> {
    const message = await this.pushMessageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Push message with ID ${id} not found`);
    }
    return message;
  }

  async create(createDto: CreatePushMessageDto): Promise<PushMessage> {
    // Validate that at least one message is provided
    if (!createDto.androidMessage && !createDto.iosMessage) {
      throw new BadRequestException('At least one message (Android or iOS) is required');
    }

    // Validate scheduled time if scheduled
    if (createDto.sendType === SendType.SCHEDULED) {
      if (!createDto.scheduledAt) {
        throw new BadRequestException('Scheduled time is required for scheduled messages');
      }
      const scheduledDate = new Date(createDto.scheduledAt);
      if (scheduledDate <= new Date()) {
        throw new BadRequestException('Scheduled time must be in the future');
      }
    }

    const message = this.pushMessageRepository.create({
      ...createDto,
      scheduledAt: createDto.scheduledAt ? new Date(createDto.scheduledAt) : null,
      status:
        createDto.sendType === SendType.SCHEDULED
          ? PushStatus.SCHEDULED
          : PushStatus.DRAFT,
    });

    const savedMessage = await this.pushMessageRepository.save(message);
    if (savedMessage.sendType === SendType.SCHEDULED && savedMessage.scheduledAt) {
      const scheduledJobId = await this.executeSchedulePushMessageJob({
        messageId: savedMessage.id,
        scheduledAt: savedMessage.scheduledAt,
      });
      savedMessage.scheduledJobId = scheduledJobId;
      return this.pushMessageRepository.save(savedMessage);
    }
    return savedMessage;
  }

  async update(id: number, updateDto: UpdatePushMessageDto): Promise<PushMessage> {
    const message = await this.findOne(id);
    const previousSendType: SendType = message.sendType;
    const previousScheduledAt: Date | null = message.scheduledAt;
    const previousScheduledJobId: string | null = message.scheduledJobId;

    // Don't allow updating sent messages
    if (message.status === PushStatus.SENT) {
      throw new BadRequestException('Cannot update a message that has already been sent');
    }

    // Validate scheduled time if updating to scheduled
    if (updateDto.sendType === SendType.SCHEDULED || message.sendType === SendType.SCHEDULED) {
      const scheduledAt = updateDto.scheduledAt
        ? new Date(updateDto.scheduledAt)
        : message.scheduledAt;
      if (!scheduledAt) {
        throw new BadRequestException('Scheduled time is required for scheduled messages');
      }
      if (scheduledAt <= new Date()) {
        throw new BadRequestException('Scheduled time must be in the future');
      }
    }

    Object.assign(message, {
      ...updateDto,
      scheduledAt: updateDto.scheduledAt ? new Date(updateDto.scheduledAt) : message.scheduledAt,
      status:
        updateDto.sendType === SendType.SCHEDULED ||
        (message.sendType === SendType.SCHEDULED && !updateDto.sendType)
          ? PushStatus.SCHEDULED
          : message.status,
    });

    const updatedMessage = await this.pushMessageRepository.save(message);
    return this.executeUpdateScheduledJob({
      message: updatedMessage,
      previousSendType,
      previousScheduledAt,
      previousScheduledJobId,
    });
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);

    // Only allow deleting draft or scheduled messages
    if (message.status === PushStatus.SENT || message.status === PushStatus.SENDING) {
      throw new BadRequestException('Cannot delete a message that has been sent or is sending');
    }
    await this.executeCancelScheduledJob({ jobId: message.scheduledJobId });

    await this.pushMessageRepository.remove(message);
  }

  async getDeviceStats(): Promise<DeviceStatsDto> {
    const [total, android, ios] = await Promise.all([
      this.deviceTokenRepository.count({
        where: { isActive: true },
      }),
      this.deviceTokenRepository.count({
        where: { isActive: true, platform: Platform.ANDROID },
      }),
      this.deviceTokenRepository.count({
        where: { isActive: true, platform: Platform.IOS },
      }),
    ]);

    return { total, android, ios };
  }

  async send(id: number): Promise<PushMessage> {
    const message = await this.findOne(id);

    if (message.status === PushStatus.SENT) {
      throw new BadRequestException('Message has already been sent');
    }

    if (message.status === PushStatus.SENDING) {
      throw new BadRequestException('Message is currently being sent');
    }
    if (message.sendType === SendType.SCHEDULED && message.scheduledJobId) {
      await this.executeCancelScheduledJob({ jobId: message.scheduledJobId });
      message.scheduledJobId = null;
      await this.pushMessageRepository.save(message);
    }

    // Update status to sending
    message.status = PushStatus.SENDING;
    await this.pushMessageRepository.save(message);

    try {
      const targetCount = await this.countTargetDeviceTokens(message.target);
      if (targetCount === 0) {
        throw new BadRequestException('No active device tokens found for the selected target');
      }
      await this.sendPushNotificationsByTopic(message);
      message.status = PushStatus.SENT;
      message.sentAt = new Date();
      message.totalSent = targetCount;

      await this.pushMessageRepository.save(message);

      return message;
    } catch (error) {
      // Revert status on error
      message.status = message.sendType === SendType.SCHEDULED ? PushStatus.SCHEDULED : PushStatus.DRAFT;
      await this.pushMessageRepository.save(message);
      throw error;
    }
  }

  async sendTest(id: number, deviceTokenIds: string[]): Promise<void> {
    const message = await this.findOne(id);

    if (deviceTokenIds.length === 0) {
      throw new BadRequestException('At least one test device must be selected');
    }

    // Get test device tokens
    const deviceTokens = await this.testDeviceTokenRepository.find({
      where: { id: In(deviceTokenIds), isActive: true },
    });

    if (deviceTokens.length === 0) {
      throw new BadRequestException('No active device tokens found for the selected devices');
    }

    // Send test push notifications
    await this.sendTestPushNotifications(message, deviceTokens);
  }

  /**
   * Sends a scheduled message if it is due.
   */
  async executeSendScheduledMessage(params: { messageId: number }): Promise<void> {
    const message = await this.findOne(params.messageId);
    const now = new Date();
    if (message.sendType !== SendType.SCHEDULED) return;
    if (!message.scheduledAt || message.scheduledAt > now) return;
    if (message.status === PushStatus.SENT || message.status === PushStatus.SENDING) return;
    // if (message.scheduledJobId) {
    //   await this.executeCancelScheduledJob({ jobId: message.scheduledJobId });
    //   message.scheduledJobId = null;
    //   await this.pushMessageRepository.save(message);
    // }
    await this.send(message.id);
  }

  private async countTargetDeviceTokens(target: PushTarget): Promise<number> {
    const where: FindOptionsWhere<DeviceToken> = { isActive: true };
    if (target === PushTarget.ANDROID) {
      where.platform = Platform.ANDROID;
    } else if (target === PushTarget.IOS) {
      where.platform = Platform.IOS;
    }
    return this.deviceTokenRepository.count({ where });
  }

  private async sendPushNotificationsByTopic(message: PushMessage): Promise<void> {
    const messagingClient = this.getMessagingClient();
    if (message.target === PushTarget.ANDROID) {
      if (!message.androidMessage) {
        throw new BadRequestException('Android message is required for Android target');
      }
      const payload = this.buildAndroidTopicMessage({ message, topic: DEVICE_TOKEN_TOPICS.ANDROID });
      await messagingClient.send(payload);
      return;
    }
    if (message.target === PushTarget.IOS) {
      if (!message.iosMessage) {
        throw new BadRequestException('iOS message is required for iOS target');
      }
      const payload = this.buildIosTopicMessage({ message, topic: DEVICE_TOKEN_TOPICS.IOS });
      await messagingClient.send(payload);
      return;
    }
    const tasks: Array<Promise<string>> = [];
    if (message.androidMessage && message.iosMessage) {
      const payload = this.buildAllTopicMessage({ message, topic: DEVICE_TOKEN_TOPICS.ALL });
      tasks.push(messagingClient.send(payload));
      await Promise.all(tasks);
      return;
    }
    if (message.androidMessage) {
      const payload = this.buildAndroidTopicMessage({ message, topic: DEVICE_TOKEN_TOPICS.ANDROID });
      tasks.push(messagingClient.send(payload));
    }
    if (message.iosMessage) {
      const payload = this.buildIosTopicMessage({ message, topic: DEVICE_TOKEN_TOPICS.IOS });
      tasks.push(messagingClient.send(payload));
    }
    if (tasks.length === 0) {
      throw new BadRequestException('At least one message (Android or iOS) is required');
    }
    await Promise.all(tasks);
  }

  private async sendTestPushNotifications(
    message: PushMessage,
    deviceTokens: TestDeviceToken[],
  ): Promise<void> {
    const messagingClient = this.getMessagingClient();
    const tasks: Array<Promise<string>> = deviceTokens.map((token: TestDeviceToken) => {
      if (token.platform === Platform.ANDROID) {
        if (!message.androidMessage) {
          throw new BadRequestException('Android message is required for Android test tokens');
        }
        const payload = this.buildAndroidTokenMessage({ message, token: token.fcmToken });
        return messagingClient.send(payload);
      }
      if (!message.iosMessage) {
        throw new BadRequestException('iOS message is required for iOS test tokens');
      }
      const payload = this.buildIosTokenMessage({ message, token: token.fcmToken });
      return messagingClient.send(payload);
    });
    await Promise.all(tasks);
  }

  private buildMessageData(message: PushMessage): Record<string, string> {
    return {
      landingUrl: message.landingUrl || '',
      pushMessageId: message.id.toString(),
    };
  }

  private buildAndroidTopicMessage(params: {
    message: PushMessage;
    topic: string;
  }): admin.messaging.Message {
    const data = this.buildMessageData(params.message);
    const androidConfig: admin.messaging.AndroidConfig = this.buildAndroidConfig({ message: params.message });
    return { topic: params.topic, data, android: androidConfig };
  }

  private buildIosTopicMessage(params: {
    message: PushMessage;
    topic: string;
  }): admin.messaging.Message {
    const data = this.buildMessageData(params.message);
    const apnsConfig: admin.messaging.ApnsConfig = this.buildApnsConfig({ message: params.message });
    return { topic: params.topic, data, apns: apnsConfig };
  }

  private buildAllTopicMessage(params: {
    message: PushMessage;
    topic: string;
  }): admin.messaging.Message {
    const data = this.buildMessageData(params.message);
    const androidConfig: admin.messaging.AndroidConfig = this.buildAndroidConfig({ message: params.message });
    const apnsConfig: admin.messaging.ApnsConfig = this.buildApnsConfig({ message: params.message });
    return { topic: params.topic, data, android: androidConfig, apns: apnsConfig };
  }

  private buildAndroidTokenMessage(params: {
    message: PushMessage;
    token: string;
  }): admin.messaging.Message {
    const data = this.buildMessageData(params.message);
    const androidConfig: admin.messaging.AndroidConfig = this.buildAndroidConfig({ message: params.message });
    return { token: params.token, data, android: androidConfig };
  }

  private buildIosTokenMessage(params: {
    message: PushMessage;
    token: string;
  }): admin.messaging.Message {
    const data = this.buildMessageData(params.message);
    const apnsConfig: admin.messaging.ApnsConfig = this.buildApnsConfig({ message: params.message });
    return { token: params.token, data, apns: apnsConfig };
  }

  private buildAndroidConfig(params: { message: PushMessage }): admin.messaging.AndroidConfig {
    const notification = {
      title: params.message.title,
      body: params.message.androidMessage || '',
      ...(params.message.imageUrl && !params.message.androidBigtext && { imageUrl: params.message.imageUrl }),
    };
    const bigTextNotification =
      params.message.androidBigtext && params.message.androidBigtext.length > 0
        ? {
            body: params.message.androidBigtext,
            style: 'bigtext',
            ...(params.message.imageUrl && { imageUrl: params.message.imageUrl }),
          }
        : null;
    return {
      priority: 'high',
      notification: bigTextNotification ? { ...notification, ...bigTextNotification } : notification,
    };
  }

  private buildApnsConfig(params: { message: PushMessage }): admin.messaging.ApnsConfig {
    const alert = { title: params.message.title, body: params.message.iosMessage || '' };
    return {
      payload: {
        aps: {
          alert,
          sound: 'default',
          ...(params.message.imageUrl && { mutableContent: true }),
        },
      },
      ...(params.message.imageUrl && {
        fcmOptions: { imageUrl: params.message.imageUrl },
      }),
    };
  }

  private getMessagingClient(): admin.messaging.Messaging {
    if (!admin.apps.length) {
      throw new BadRequestException('Firebase Admin is not initialized');
    }
    return admin.messaging();
  }

  // Method to process scheduled messages (to be called by a cron job or queue processor)
  async processScheduledMessages(): Promise<void> {
    const now = new Date();
    const scheduledMessages = await this.pushMessageRepository.find({
      where: {
        status: PushStatus.SCHEDULED,
        sendType: SendType.SCHEDULED,
        scheduledAt: LessThanOrEqual(now),
      },
    });

    for (const message of scheduledMessages) {
      try {
        await this.send(message.id);
      } catch (error) {
        console.error(`Error processing scheduled message ${message.id}:`, error);
      }
    }
  }

  private async executeUpdateScheduledJob(params: {
    message: PushMessage;
    previousSendType: SendType;
    previousScheduledAt: Date | null;
    previousScheduledJobId: string | null;
  }): Promise<PushMessage> {
    const shouldSchedule: boolean =
      params.message.sendType === SendType.SCHEDULED && !!params.message.scheduledAt;
    const isScheduleChanged: boolean =
      params.previousSendType !== params.message.sendType ||
      this.isScheduledAtChanged({
        previousScheduledAt: params.previousScheduledAt,
        scheduledAt: params.message.scheduledAt,
      });
    if (!shouldSchedule) {
      await this.executeCancelScheduledJob({ jobId: params.previousScheduledJobId });
      if (params.message.scheduledJobId) {
        params.message.scheduledJobId = null;
        return this.pushMessageRepository.save(params.message);
      }
      return params.message;
    }
    if (!isScheduleChanged && params.message.scheduledJobId) return params.message;
    await this.executeCancelScheduledJob({ jobId: params.previousScheduledJobId });
    const scheduledJobId = await this.executeSchedulePushMessageJob({
      messageId: params.message.id,
      scheduledAt: params.message.scheduledAt,
    });
    params.message.scheduledJobId = scheduledJobId;
    return this.pushMessageRepository.save(params.message);
  }

  private async executeSchedulePushMessageJob(params: {
    messageId: number;
    scheduledAt: Date;
  }): Promise<string> {
    const jobId: string = this.buildScheduledJobId(params.messageId);
    const delayMs: number = Math.max(params.scheduledAt.getTime() - Date.now(), 0);
    await this.scheduledQueue.add(
      PUSH_MESSAGE_QUEUE.JOB.SEND_SCHEDULED,
      { messageId: params.messageId },
      { delay: delayMs, jobId },
    );
    return jobId;
  }

  private async executeCancelScheduledJob(params: { jobId: string | null }): Promise<void> {
    if (!params.jobId) return;
    await this.scheduledQueue.removeJobs(params.jobId);
  }

  private buildScheduledJobId(messageId: number): string {
    return `push-scheduled-${messageId}`;
  }

  private isScheduledAtChanged(params: {
    previousScheduledAt: Date | null;
    scheduledAt: Date | null;
  }): boolean {
    if (!params.previousScheduledAt && !params.scheduledAt) return false;
    if (!params.previousScheduledAt || !params.scheduledAt) return true;
    return params.previousScheduledAt.getTime() !== params.scheduledAt.getTime();
  }

}

