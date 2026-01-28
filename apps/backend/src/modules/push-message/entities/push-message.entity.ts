import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum PushTarget {
  ALL = 'all',
  ANDROID = 'android',
  IOS = 'ios',
}

export enum PushStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENDING = 'sending',
  SENT = 'sent',
}

export enum SendType {
  IMMEDIATE = 'immediate',
  SCHEDULED = 'scheduled',
}

@Entity('push_messages')
export class PushMessage {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Push notification title' })
  @Column({ length: 100 })
  title: string;

  @ApiProperty({ description: 'Android message content' })
  @Column({ name: 'android_message', type: 'text', nullable: true })
  androidMessage: string;

  @ApiProperty({ description: 'Android big text (expanded content)' })
  @Column({ name: 'android_bigtext', type: 'text', nullable: true })
  androidBigtext: string;

  @ApiProperty({ description: 'iOS message content' })
  @Column({ name: 'ios_message', type: 'text', nullable: true })
  iosMessage: string;

  @ApiProperty({ description: 'Push notification image URL (800x464)' })
  @Column({ name: 'image_url', length: 255, nullable: true })
  imageUrl: string;

  @ApiProperty({ description: 'Landing URL (deep link)' })
  @Column({ name: 'landing_url', length: 255, nullable: true })
  landingUrl: string;

  @ApiProperty({ enum: PushTarget })
  @Column({
    type: 'enum',
    enum: PushTarget,
    default: PushTarget.ALL,
  })
  target: PushTarget;

  @ApiProperty({ enum: PushStatus })
  @Column({
    type: 'enum',
    enum: PushStatus,
    default: PushStatus.DRAFT,
  })
  status: PushStatus;

  @ApiProperty({ enum: SendType })
  @Column({
    name: 'send_type',
    type: 'enum',
    enum: SendType,
    default: SendType.IMMEDIATE,
  })
  sendType: SendType;

  @ApiProperty()
  @Column({ name: 'scheduled_at', type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @ApiProperty()
  @Column({ name: 'scheduled_job_id', length: 64, nullable: true })
  scheduledJobId: string | null;

  @ApiProperty()
  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt: Date;

  @ApiProperty()
  @Column({ name: 'total_sent', default: 0 })
  totalSent: number;

  @ApiProperty()
  @Column({ name: 'total_views', default: 0 })
  totalViews: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

