import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In } from 'typeorm';
import { PushMessage, PushStatus, PushTarget, SendType } from './entities/push-message.entity';
import { CreatePushMessageDto } from './dto/create-push-message.dto';
import { UpdatePushMessageDto } from './dto/update-push-message.dto';
import { DeviceToken, Platform } from '../device-token/entities/device-token.entity';
import { TestDeviceToken } from '../test-device-token/entities/test-device-token.entity';
import { DeviceStatsDto } from './dto/device-stats.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class PushMessageService {
  constructor(
    @InjectRepository(PushMessage)
    private pushMessageRepository: Repository<PushMessage>,
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
    @InjectRepository(TestDeviceToken)
    private testDeviceTokenRepository: Repository<TestDeviceToken>,
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

    return this.pushMessageRepository.save(message);
  }

  async update(id: number, updateDto: UpdatePushMessageDto): Promise<PushMessage> {
    const message = await this.findOne(id);

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

    return this.pushMessageRepository.save(message);
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);

    // Only allow deleting draft or scheduled messages
    if (message.status === PushStatus.SENT || message.status === PushStatus.SENDING) {
      throw new BadRequestException('Cannot delete a message that has been sent or is sending');
    }

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

    // Update status to sending
    message.status = PushStatus.SENDING;
    await this.pushMessageRepository.save(message);

    try {
      // Get target device tokens
      const deviceTokens = await this.getTargetDeviceTokens(message.target);

      if (deviceTokens.length === 0) {
        throw new BadRequestException('No active device tokens found for the selected target');
      }

      // Send push notifications
      const results = await this.sendPushNotifications(message, deviceTokens);

      // Update message with results
      message.status = PushStatus.SENT;
      message.sentAt = new Date();
      message.totalSent = results.successCount;

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
    await this.sendPushNotifications(message, deviceTokens);
  }

  private async getTargetDeviceTokens(target: PushTarget): Promise<DeviceToken[]> {
    // Prefer test tokens from environment for easier manual testing
    const testTokens = this.getTestDeviceTokensFromEnv(target);
    if (testTokens) {
      return testTokens;
    }

    const where: any = { isActive: true };

    if (target === PushTarget.ANDROID) {
      where.platform = Platform.ANDROID;
    } else if (target === PushTarget.IOS) {
      where.platform = Platform.IOS;
    }
    // If target is ALL, no platform filter

    return this.deviceTokenRepository.find({ where });
  }

  private async sendPushNotifications(
    message: PushMessage,
    deviceTokens: Array<{ fcmToken: string; platform: Platform }>,
  ): Promise<{ successCount: number; failureCount: number }> {
    if (!admin.apps.length) {
      throw new BadRequestException('Firebase Admin is not initialized');
    }

    let successCount = 0;
    let failureCount = 0;

    // Group tokens by platform for batch sending
    const androidTokens = deviceTokens
      .filter((dt) => dt.platform === Platform.ANDROID)
      .map((dt) => dt.fcmToken);
    const iosTokens = deviceTokens
      .filter((dt) => dt.platform === Platform.IOS)
      .map((dt) => dt.fcmToken);

    // Send to Android devices
    if (androidTokens.length > 0 && message.androidMessage) {
      const androidMessage: any = {
        notification: {
          title: message.title,
          body: message.androidMessage,
        },
        data: {
          landingUrl: message.landingUrl || '',
          pushMessageId: message.id.toString(),
        },
        android: {
          priority: 'high' as const,
          ...(message.androidBigtext && {
            notification: {
              body: message.androidBigtext,
              style: 'bigtext',
              ...(message.imageUrl && { imageUrl: message.imageUrl }),
            },
          }),
          ...(message.imageUrl && !message.androidBigtext && {
            notification: {
              imageUrl: message.imageUrl,
            },
          }),
        },
      };

      try {
        const response = await admin.messaging().sendEachForMulticast({
          tokens: androidTokens,
          ...androidMessage,
        });
        successCount += response.successCount;
        failureCount += response.failureCount;
      } catch (error) {
        console.error('Error sending Android push notifications:', error);
        failureCount += androidTokens.length;
      }
    }

    // Send to iOS devices
    if (iosTokens.length > 0 && message.iosMessage) {
      const iosMessage = {
        notification: {
          title: message.title,
          body: message.iosMessage,
        },
        data: {
          landingUrl: message.landingUrl || '',
          pushMessageId: message.id.toString(),
        },
        apns: {
          payload: {
            aps: {
              alert: {
                title: message.title,
                body: message.iosMessage,
              },
              sound: 'default',
              ...(message.imageUrl && { mutableContent: true }),
            },
          },
          ...(message.imageUrl && {
            fcmOptions: {
              imageUrl: message.imageUrl,
            },
          }),
        },
      };

      try {
        const response = await admin.messaging().sendEachForMulticast({
          tokens: iosTokens,
          ...iosMessage,
        });
        successCount += response.successCount;
        failureCount += response.failureCount;
      } catch (error) {
        console.error('Error sending iOS push notifications:', error);
        failureCount += iosTokens.length;
      }
    }

    return { successCount, failureCount };
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

  private getTestDeviceTokensFromEnv(target: PushTarget): DeviceToken[] | null {
    const raw =
      process.env.TEST_DEVICE_TOKENS ||
      process.env.test_device_tokens ||
      process.env.Test_Device_Tokens;

    if (!raw) return null;

    const entries = raw
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    if (entries.length === 0) return null;

    const parsed = entries
      .map((entry) => {
        const [maybePlatform, ...rest] = entry.split(':').map((v) => v.trim());
        const token =
          rest.length > 0 && maybePlatform ? rest.join(':') : entry;

        // Determine platform:
        // - explicit prefix "android:" or "ios:"
        // - otherwise fall back to the current target
        // - if target is ALL, default to ANDROID
        let platform: Platform;
        if (maybePlatform?.toLowerCase() === Platform.ANDROID) {
          platform = Platform.ANDROID;
        } else if (maybePlatform?.toLowerCase() === Platform.IOS) {
          platform = Platform.IOS;
        } else if (target === PushTarget.IOS) {
          platform = Platform.IOS;
        } else {
          platform = Platform.ANDROID;
        }

        return {
          id: '00000000-0000-0000-0000-000000000000',
          userId: null,
          fcmToken: token,
          platform,
          appVersion: null,
          isActive: true,
          lastSeenAt: null,
          createdAt: new Date(0),
          updatedAt: new Date(0),
        } as DeviceToken;
      })
      // If target is specific, keep only matching platform
      .filter((dt) => {
        const targetPlatform =
          target === PushTarget.ANDROID
            ? Platform.ANDROID
            : target === PushTarget.IOS
            ? Platform.IOS
            : null;
        return !targetPlatform || dt.platform === targetPlatform;
      });

    return parsed.length > 0 ? parsed : null;
  }
}

