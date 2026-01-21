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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const push_message_entity_1 = require("./entities/push-message.entity");
const device_token_entity_1 = require("../device-token/entities/device-token.entity");
const test_device_token_entity_1 = require("../test-device-token/entities/test-device-token.entity");
const admin = require("firebase-admin");
let PushMessageService = class PushMessageService {
    constructor(pushMessageRepository, deviceTokenRepository, testDeviceTokenRepository) {
        this.pushMessageRepository = pushMessageRepository;
        this.deviceTokenRepository = deviceTokenRepository;
        this.testDeviceTokenRepository = testDeviceTokenRepository;
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
        return this.pushMessageRepository.save(message);
    }
    async update(id, updateDto) {
        const message = await this.findOne(id);
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
        return this.pushMessageRepository.save(message);
    }
    async remove(id) {
        const message = await this.findOne(id);
        if (message.status === push_message_entity_1.PushStatus.SENT || message.status === push_message_entity_1.PushStatus.SENDING) {
            throw new common_1.BadRequestException('Cannot delete a message that has been sent or is sending');
        }
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
        message.status = push_message_entity_1.PushStatus.SENDING;
        await this.pushMessageRepository.save(message);
        try {
            const deviceTokens = await this.getTargetDeviceTokens(message.target);
            if (deviceTokens.length === 0) {
                throw new common_1.BadRequestException('No active device tokens found for the selected target');
            }
            const results = await this.sendPushNotifications(message, deviceTokens);
            message.status = push_message_entity_1.PushStatus.SENT;
            message.sentAt = new Date();
            message.totalSent = results.successCount;
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
        await this.sendPushNotifications(message, deviceTokens);
    }
    async getTargetDeviceTokens(target) {
        const testTokens = this.getTestDeviceTokensFromEnv(target);
        if (testTokens) {
            return testTokens;
        }
        const where = { isActive: true };
        if (target === push_message_entity_1.PushTarget.ANDROID) {
            where.platform = device_token_entity_1.Platform.ANDROID;
        }
        else if (target === push_message_entity_1.PushTarget.IOS) {
            where.platform = device_token_entity_1.Platform.IOS;
        }
        return this.deviceTokenRepository.find({ where });
    }
    async sendPushNotifications(message, deviceTokens) {
        if (!admin.apps.length) {
            throw new common_1.BadRequestException('Firebase Admin is not initialized');
        }
        let successCount = 0;
        let failureCount = 0;
        const androidTokens = deviceTokens
            .filter((dt) => dt.platform === device_token_entity_1.Platform.ANDROID)
            .map((dt) => dt.fcmToken);
        const iosTokens = deviceTokens
            .filter((dt) => dt.platform === device_token_entity_1.Platform.IOS)
            .map((dt) => dt.fcmToken);
        if (androidTokens.length > 0 && message.androidMessage) {
            const androidMessage = {
                notification: {
                    title: message.title,
                    body: message.androidMessage,
                },
                data: {
                    landingUrl: message.landingUrl || '',
                    pushMessageId: message.id.toString(),
                },
                android: {
                    priority: 'high',
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
            }
            catch (error) {
                console.error('Error sending Android push notifications:', error);
                failureCount += androidTokens.length;
            }
        }
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
            }
            catch (error) {
                console.error('Error sending iOS push notifications:', error);
                failureCount += iosTokens.length;
            }
        }
        return { successCount, failureCount };
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
    getTestDeviceTokensFromEnv(target) {
        const raw = process.env.TEST_DEVICE_TOKENS ||
            process.env.test_device_tokens ||
            process.env.Test_Device_Tokens;
        if (!raw)
            return null;
        const entries = raw
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);
        if (entries.length === 0)
            return null;
        const parsed = entries
            .map((entry) => {
            const [maybePlatform, ...rest] = entry.split(':').map((v) => v.trim());
            const token = rest.length > 0 && maybePlatform ? rest.join(':') : entry;
            let platform;
            if (maybePlatform?.toLowerCase() === device_token_entity_1.Platform.ANDROID) {
                platform = device_token_entity_1.Platform.ANDROID;
            }
            else if (maybePlatform?.toLowerCase() === device_token_entity_1.Platform.IOS) {
                platform = device_token_entity_1.Platform.IOS;
            }
            else if (target === push_message_entity_1.PushTarget.IOS) {
                platform = device_token_entity_1.Platform.IOS;
            }
            else {
                platform = device_token_entity_1.Platform.ANDROID;
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
            };
        })
            .filter((dt) => {
            const targetPlatform = target === push_message_entity_1.PushTarget.ANDROID
                ? device_token_entity_1.Platform.ANDROID
                : target === push_message_entity_1.PushTarget.IOS
                    ? device_token_entity_1.Platform.IOS
                    : null;
            return !targetPlatform || dt.platform === targetPlatform;
        });
        return parsed.length > 0 ? parsed : null;
    }
};
exports.PushMessageService = PushMessageService;
exports.PushMessageService = PushMessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(push_message_entity_1.PushMessage)),
    __param(1, (0, typeorm_1.InjectRepository)(device_token_entity_1.DeviceToken)),
    __param(2, (0, typeorm_1.InjectRepository)(test_device_token_entity_1.TestDeviceToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PushMessageService);
//# sourceMappingURL=push-message.service.js.map