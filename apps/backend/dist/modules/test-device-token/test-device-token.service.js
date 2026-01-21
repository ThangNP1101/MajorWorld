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
exports.TestDeviceTokenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const test_device_token_entity_1 = require("./entities/test-device-token.entity");
let TestDeviceTokenService = class TestDeviceTokenService {
    constructor(testDeviceTokenRepository) {
        this.testDeviceTokenRepository = testDeviceTokenRepository;
    }
    async findAll() {
        return this.testDeviceTokenRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const token = await this.testDeviceTokenRepository.findOne({ where: { id } });
        if (!token) {
            throw new common_1.NotFoundException(`Test device token with ID ${id} not found`);
        }
        return token;
    }
    async create(createDto) {
        const token = this.testDeviceTokenRepository.create({
            userId: createDto.userId ?? null,
            fcmToken: createDto.fcmToken,
            platform: createDto.platform,
            appVersion: createDto.appVersion ?? null,
            isActive: createDto.isActive ?? true,
            lastSeenAt: createDto.lastSeenAt ? new Date(createDto.lastSeenAt) : null,
        });
        try {
            return await this.testDeviceTokenRepository.save(token);
        }
        catch (error) {
            if (error?.code === '23505') {
                throw new common_1.BadRequestException('FCM token already exists');
            }
            throw error;
        }
    }
    async remove(id) {
        const token = await this.findOne(id);
        await this.testDeviceTokenRepository.remove(token);
    }
};
exports.TestDeviceTokenService = TestDeviceTokenService;
exports.TestDeviceTokenService = TestDeviceTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(test_device_token_entity_1.TestDeviceToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TestDeviceTokenService);
//# sourceMappingURL=test-device-token.service.js.map