import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestDeviceToken } from './entities/test-device-token.entity';
import { CreateTestDeviceTokenDto } from './dto/create-test-device-token.dto';

@Injectable()
export class TestDeviceTokenService {
  constructor(
    @InjectRepository(TestDeviceToken)
    private testDeviceTokenRepository: Repository<TestDeviceToken>,
  ) {}

  async findAll(): Promise<TestDeviceToken[]> {
    return this.testDeviceTokenRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TestDeviceToken> {
    const token = await this.testDeviceTokenRepository.findOne({ where: { id } });
    if (!token) {
      throw new NotFoundException(`Test device token with ID ${id} not found`);
    }
    return token;
  }

  async create(createDto: CreateTestDeviceTokenDto): Promise<TestDeviceToken> {
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
    } catch (error) {
      if (error?.code === '23505') {
        throw new BadRequestException('FCM token already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const token = await this.findOne(id);
    await this.testDeviceTokenRepository.remove(token);
  }
}
