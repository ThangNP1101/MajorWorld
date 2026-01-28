import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TopicSyncStatus } from '../enums/topic-sync-status.enum';

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

  @ApiProperty({ enum: TopicSyncStatus })
  @Column({
    name: 'topics_sync_status',
    type: 'enum',
    enum: TopicSyncStatus,
    default: TopicSyncStatus.PENDING,
  })
  topicsSyncStatus: TopicSyncStatus;

  @ApiProperty({ description: 'List of synced topics' })
  @Column({
    name: 'topics_synced_list',
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  topicsSyncedList: string[];

  @ApiProperty({ description: 'Last topic sync attempt time' })
  @Column({ name: 'topics_sync_attempted_at', type: 'timestamp', nullable: true })
  topicsSyncAttemptedAt: Date;

  @ApiProperty({ description: 'Retry count for topic sync' })
  @Column({ name: 'topics_sync_retry_count', default: 0 })
  topicsSyncRetryCount: number;

  @ApiProperty({ description: 'Last topic sync error', nullable: true })
  @Column({ name: 'topics_sync_error', length: 500, nullable: true })
  topicsSyncError: string;

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

