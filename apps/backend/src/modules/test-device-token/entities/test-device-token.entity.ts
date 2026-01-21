import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Platform } from '../../device-token/entities/device-token.entity';

@Entity('test_device_tokens')
export class TestDeviceToken {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID (nullable if not logged in)' })
  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ApiProperty({ description: 'FCM token' })
  @Index({ unique: true })
  @Column({ name: 'fcm_token', length: 255 })
  fcmToken: string;

  @ApiProperty({ enum: Platform })
  @Column({
    type: 'enum',
    enum: Platform,
    enumName: 'device_tokens_platform_enum',
  })
  platform: Platform;

  @ApiProperty({ description: 'App version' })
  @Column({ name: 'app_version', length: 20, nullable: true })
  appVersion: string;

  @ApiProperty({ description: 'Is token active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty()
  @Column({ name: 'last_seen_at', type: 'timestamp', nullable: true })
  lastSeenAt: Date;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
