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
exports.PushMessageService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const push_message_entity_1 = require("./entities/push-message.entity");
const device_token_entity_1 = require("../device-token/entities/device-token.entity");
const test_device_token_entity_1 = require("../test-device-token/entities/test-device-token.entity");
const push_message_queue_constants_1 = require("./push-message-queue.constants");
const device_token_topics_constants_1 = require("../device-token/constants/device-token-topics.constants");
const admin = require("firebase-admin");
let PushMessageService = class PushMessageService {
    constructor(pushMessageRepository, deviceTokenRepository, testDeviceTokenRepository, scheduledQueue) {
        this.pushMessageRepository = pushMessageRepository;
        this.deviceTokenRepository = deviceTokenRepository;
        this.testDeviceTokenRepository = testDeviceTokenRepository;
        this.scheduledQueue = scheduledQueue;
        if (!admin.apps.length) {
            try {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    }),
                });
            }
            catch (error) {
                console.warn('Firebase Admin initialization failed:', error.message);
            }
        }
    }
    async findAll() {
        return this.pushMessageRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findScheduled() {
        return this.pushMessageRepository.find({
            where: {
                status: push_message_entity_1.PushStatus.SCHEDULED,
                sendType: push_message_entity_1.SendType.SCHEDULED,
            },
            order: { scheduledAt: 'ASC' },
        });
    }
    async findOne(id) {
        const message = await this.pushMessageRepository.findOne({ where: { id } });
        if (!message) {
            throw new common_1.NotFoundException(`Push message with ID ${id} not found`);
        }
        return message;
    }
    async create(createDto) {
        if (!createDto.androidMessage && !createDto.iosMessage) {
            throw new common_1.BadRequestException('At least one message (Android or iOS) is required');
        }
        if (createDto.sendType === push_message_entity_1.SendType.SCHEDULED) {
            if (!createDto.scheduledAt) {
                throw new common_1.BadRequestException('Scheduled time is required for scheduled messages');
            }
            const scheduledDate = new Date(createDto.scheduledAt);
            if (scheduledDate <= new Date()) {
                throw new common_1.BadRequestException('Scheduled time must be in the future');
            }
        }
        const message = this.pushMessageRepository.create({
            ...createDto,
            scheduledAt: createDto.scheduledAt ? new Date(createDto.scheduledAt) : null,
            status: createDto.sendType === push_message_entity_1.SendType.SCHEDULED
                ? push_message_entity_1.PushStatus.SCHEDULED
                : push_message_entity_1.PushStatus.DRAFT,
        });
        const savedMessage = await this.pushMessageRepository.save(message);
        if (savedMessage.sendType === push_message_entity_1.SendType.SCHEDULED && savedMessage.scheduledAt) {
            const scheduledJobId = await this.executeSchedulePushMessageJob({
                messageId: savedMessage.id,
                scheduledAt: savedMessage.scheduledAt,
            });
            savedMessage.scheduledJobId = scheduledJobId;
            return this.pushMessageRepository.save(savedMessage);
        }
        return savedMessage;
    }
    async update(id, updateDto) {
        const message = await this.findOne(id);
        const previousSendType = message.sendType;
        const previousScheduledAt = message.scheduledAt;
        const previousScheduledJobId = message.scheduledJobId;
        if (message.status === push_message_entity_1.PushStatus.SENT) {
            throw new common_1.BadRequestException('Cannot update a message that has already been sent');
        }
        if (updateDto.sendType === push_message_entity_1.SendType.SCHEDULED || message.sendType === push_message_entity_1.SendType.SCHEDULED) {
            const scheduledAt = updateDto.scheduledAt
                ? new Date(updateDto.scheduledAt)
                : message.scheduledAt;
            if (!scheduledAt) {
                throw new common_1.BadRequestException('Scheduled time is required for scheduled messages');
            }
            if (scheduledAt <= new Date()) {
                throw new common_1.BadRequestException('Scheduled time must be in the future');
            }
        }
        Object.assign(message, {
            ...updateDto,
            scheduledAt: updateDto.scheduledAt ? new Date(updateDto.scheduledAt) : message.scheduledAt,
            status: updateDto.sendType === push_message_entity_1.SendType.SCHEDULED ||
                (message.sendType === push_message_entity_1.SendType.SCHEDULED && !updateDto.sendType)
                ? push_message_entity_1.PushStatus.SCHEDULED
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
    async remove(id) {
        const message = await this.findOne(id);
        if (message.status === push_message_entity_1.PushStatus.SENT || message.status === push_message_entity_1.PushStatus.SENDING) {
            throw new common_1.BadRequestException('Cannot delete a message that has been sent or is sending');
        }
        await this.executeCancelScheduledJob({ jobId: message.scheduledJobId });
        await this.pushMessageRepository.remove(message);
    }
    async getDeviceStats() {
        const [total, android, ios] = await Promise.all([
            this.deviceTokenRepository.count({
                where: { isActive: true },
            }),
            this.deviceTokenRepository.count({
                where: { isActive: true, platform: device_token_entity_1.Platform.ANDROID },
            }),
            this.deviceTokenRepository.count({
                where: { isActive: true, platform: device_token_entity_1.Platform.IOS },
            }),
        ]);
        return { total, android, ios };
    }
    async send(id) {
        const message = await this.findOne(id);
        if (message.status === push_message_entity_1.PushStatus.SENT) {
            throw new common_1.BadRequestException('Message has already been sent');
        }
        if (message.status === push_message_entity_1.PushStatus.SENDING) {
            throw new common_1.BadRequestException('Message is currently being sent');
        }
        if (message.sendType === push_message_entity_1.SendType.SCHEDULED && message.scheduledJobId) {
            await this.executeCancelScheduledJob({ jobId: message.scheduledJobId });
            message.scheduledJobId = null;
            await this.pushMessageRepository.save(message);
        }
        message.status = push_message_entity_1.PushStatus.SENDING;
        await this.pushMessageRepository.save(message);
        try {
            const targetCount = await this.countTargetDeviceTokens(message.target);
            if (targetCount === 0) {
                throw new common_1.BadRequestException('No active device tokens found for the selected target');
            }
            await this.sendPushNotificationsByTopic(message);
            message.status = push_message_entity_1.PushStatus.SENT;
            message.sentAt = new Date();
            message.totalSent = targetCount;
            await this.pushMessageRepository.save(message);
            return message;
        }
        catch (error) {
            message.status = message.sendType === push_message_entity_1.SendType.SCHEDULED ? push_message_entity_1.PushStatus.SCHEDULED : push_message_entity_1.PushStatus.DRAFT;
            await this.pushMessageRepository.save(message);
            throw error;
        }
    }
    async sendTest(id, deviceTokenIds) {
        const message = await this.findOne(id);
        if (deviceTokenIds.length === 0) {
            throw new common_1.BadRequestException('At least one test device must be selected');
        }
        const deviceTokens = await this.testDeviceTokenRepository.find({
            where: { id: (0, typeorm_2.In)(deviceTokenIds), isActive: true },
        });
        if (deviceTokens.length === 0) {
            throw new common_1.BadRequestException('No active device tokens found for the selected devices');
        }
        await this.sendTestPushNotifications(message, deviceTokens);
    }
    async executeSendScheduledMessage(params) {
        const message = await this.findOne(params.messageId);
        const now = new Date();
        if (message.sendType !== push_message_entity_1.SendType.SCHEDULED)
            return;
        if (!message.scheduledAt || message.scheduledAt > now)
            return;
        if (message.status === push_message_entity_1.PushStatus.SENT || message.status === push_message_entity_1.PushStatus.SENDING)
            return;
        await this.send(message.id);
    }
    async countTargetDeviceTokens(target) {
        const where = { isActive: true };
        if (target === push_message_entity_1.PushTarget.ANDROID) {
            where.platform = device_token_entity_1.Platform.ANDROID;
        }
        else if (target === push_message_entity_1.PushTarget.IOS) {
            where.platform = device_token_entity_1.Platform.IOS;
        }
        return this.deviceTokenRepository.count({ where });
    }
    async sendPushNotificationsByTopic(message) {
        const messagingClient = this.getMessagingClient();
        if (message.target === push_message_entity_1.PushTarget.ANDROID) {
            if (!message.androidMessage) {
                throw new common_1.BadRequestException('Android message is required for Android target');
            }
            const payload = this.buildAndroidTopicMessage({ message, topic: device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.ANDROID });
            await messagingClient.send(payload);
            return;
        }
        if (message.target === push_message_entity_1.PushTarget.IOS) {
            if (!message.iosMessage) {
                throw new common_1.BadRequestException('iOS message is required for iOS target');
            }
            const payload = this.buildIosTopicMessage({ message, topic: device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.IOS });
            await messagingClient.send(payload);
            return;
        }
        const tasks = [];
        if (message.androidMessage && message.iosMessage) {
            const payload = this.buildAllTopicMessage({ message, topic: device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.ALL });
            tasks.push(messagingClient.send(payload));
            await Promise.all(tasks);
            return;
        }
        if (message.androidMessage) {
            const payload = this.buildAndroidTopicMessage({ message, topic: device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.ANDROID });
            tasks.push(messagingClient.send(payload));
        }
        if (message.iosMessage) {
            const payload = this.buildIosTopicMessage({ message, topic: device_token_topics_constants_1.DEVICE_TOKEN_TOPICS.IOS });
            tasks.push(messagingClient.send(payload));
        }
        if (tasks.length === 0) {
            throw new common_1.BadRequestException('At least one message (Android or iOS) is required');
        }
        await Promise.all(tasks);
    }
    async sendTestPushNotifications(message, deviceTokens) {
        const messagingClient = this.getMessagingClient();
        const tasks = deviceTokens.map((token) => {
            if (token.platform === device_token_entity_1.Platform.ANDROID) {
                if (!message.androidMessage) {
                    throw new common_1.BadRequestException('Android message is required for Android test tokens');
                }
                const payload = this.buildAndroidTokenMessage({ message, token: token.fcmToken });
                return messagingClient.send(payload);
            }
            if (!message.iosMessage) {
                throw new common_1.BadRequestException('iOS message is required for iOS test tokens');
            }
            const payload = this.buildIosTokenMessage({ message, token: token.fcmToken });
            return messagingClient.send(payload);
        });
        await Promise.all(tasks);
    }
    buildMessageData(message) {
        return {
            landingUrl: message.landingUrl || '',
            pushMessageId: message.id.toString(),
        };
    }
    buildAndroidTopicMessage(params) {
        const data = this.buildMessageData(params.message);
        const androidConfig = this.buildAndroidConfig({ message: params.message });
        return { topic: params.topic, data, android: androidConfig };
    }
    buildIosTopicMessage(params) {
        const data = this.buildMessageData(params.message);
        const apnsConfig = this.buildApnsConfig({ message: params.message });
        return { topic: params.topic, data, apns: apnsConfig };
    }
    buildAllTopicMessage(params) {
        const data = this.buildMessageData(params.message);
        const androidConfig = this.buildAndroidConfig({ message: params.message });
        const apnsConfig = this.buildApnsConfig({ message: params.message });
        return { topic: params.topic, data, android: androidConfig, apns: apnsConfig };
    }
    buildAndroidTokenMessage(params) {
        const data = this.buildMessageData(params.message);
        const androidConfig = this.buildAndroidConfig({ message: params.message });
        return { token: params.token, data, android: androidConfig };
    }
    buildIosTokenMessage(params) {
        const data = this.buildMessageData(params.message);
        const apnsConfig = this.buildApnsConfig({ message: params.message });
        return { token: params.token, data, apns: apnsConfig };
    }
    buildAndroidConfig(params) {
        const notification = {
            title: params.message.title,
            body: params.message.androidMessage || '',
            ...(params.message.imageUrl && !params.message.androidBigtext && { imageUrl: params.message.imageUrl }),
        };
        const bigTextNotification = params.message.androidBigtext && params.message.androidBigtext.length > 0
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
    buildApnsConfig(params) {
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
    getMessagingClient() {
        if (!admin.apps.length) {
            throw new common_1.BadRequestException('Firebase Admin is not initialized');
        }
        return admin.messaging();
    }
    async processScheduledMessages() {
        const now = new Date();
        const scheduledMessages = await this.pushMessageRepository.find({
            where: {
                status: push_message_entity_1.PushStatus.SCHEDULED,
                sendType: push_message_entity_1.SendType.SCHEDULED,
                scheduledAt: (0, typeorm_2.LessThanOrEqual)(now),
            },
        });
        for (const message of scheduledMessages) {
            try {
                await this.send(message.id);
            }
            catch (error) {
                console.error(`Error processing scheduled message ${message.id}:`, error);
            }
        }
    }
    async executeUpdateScheduledJob(params) {
        const shouldSchedule = params.message.sendType === push_message_entity_1.SendType.SCHEDULED && !!params.message.scheduledAt;
        const isScheduleChanged = params.previousSendType !== params.message.sendType ||
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
        if (!isScheduleChanged && params.message.scheduledJobId)
            return params.message;
        await this.executeCancelScheduledJob({ jobId: params.previousScheduledJobId });
        const scheduledJobId = await this.executeSchedulePushMessageJob({
            messageId: params.message.id,
            scheduledAt: params.message.scheduledAt,
        });
        params.message.scheduledJobId = scheduledJobId;
        return this.pushMessageRepository.save(params.message);
    }
    async executeSchedulePushMessageJob(params) {
        const jobId = this.buildScheduledJobId(params.messageId);
        const delayMs = Math.max(params.scheduledAt.getTime() - Date.now(), 0);
        await this.scheduledQueue.add(push_message_queue_constants_1.PUSH_MESSAGE_QUEUE.JOB.SEND_SCHEDULED, { messageId: params.messageId }, { delay: delayMs, jobId });
        return jobId;
    }
    async executeCancelScheduledJob(params) {
        if (!params.jobId)
            return;
        await this.scheduledQueue.removeJobs(params.jobId);
    }
    buildScheduledJobId(messageId) {
        return `push-scheduled-${messageId}`;
    }
    isScheduledAtChanged(params) {
        if (!params.previousScheduledAt && !params.scheduledAt)
            return false;
        if (!params.previousScheduledAt || !params.scheduledAt)
            return true;
        return params.previousScheduledAt.getTime() !== params.scheduledAt.getTime();
    }
};
exports.PushMessageService = PushMessageService;
exports.PushMessageService = PushMessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(push_message_entity_1.PushMessage)),
    __param(1, (0, typeorm_1.InjectRepository)(device_token_entity_1.DeviceToken)),
    __param(2, (0, typeorm_1.InjectRepository)(test_device_token_entity_1.TestDeviceToken)),
    __param(3, (0, bull_1.InjectQueue)(push_message_queue_constants_1.PUSH_MESSAGE_QUEUE.QUEUE_NAME)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object])
], PushMessageService);
//# sourceMappingURL=push-message.service.js.map