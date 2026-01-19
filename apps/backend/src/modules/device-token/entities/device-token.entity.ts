import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum Platform {
  ANDROID = 'android',
  IOS = 'ios',
}

@Entity('device_tokens')
export class DeviceToken {
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

