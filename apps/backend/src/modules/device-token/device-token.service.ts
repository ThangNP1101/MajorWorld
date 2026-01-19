import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceToken } from './entities/device-token.entity';
import { CreateDeviceTokenDto } from './dto/create-device-token.dto';

@Injectable()
export class DeviceTokenService {
  constructor(
    @InjectRepository(DeviceToken)
    private deviceTokenRepository: Repository<DeviceToken>,
  ) {}

  async findAll(): Promise<DeviceToken[]> {
    return this.deviceTokenRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<DeviceToken> {
    const token = await this.deviceTokenRepository.findOne({ where: { id } });
    if (!token) {
      throw new NotFoundException(`Device token with ID ${id} not found`);
    }
    return token;
  }

  async create(createDto: CreateDeviceTokenDto): Promise<DeviceToken> {
    const token = this.deviceTokenRepository.create({
      userId: createDto.userId ?? null,
      fcmToken: createDto.fcmToken,
      platform: createDto.platform,
      appVersion: createDto.appVersion ?? null,
      isActive: createDto.isActive ?? true,
      lastSeenAt: createDto.lastSeenAt ? new Date(createDto.lastSeenAt) : null,
    });

    try {
      return await this.deviceTokenRepository.save(token);
    } catch (error) {
      if (error?.code === '23505') {
        throw new BadRequestException('FCM token already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const token = await this.findOne(id);
    await this.deviceTokenRepository.remove(token);
  }
}
