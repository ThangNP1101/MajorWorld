import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PushMessage } from '../../push-message/entities/push-message.entity';
import { DeviceToken } from '../../device-token/entities/device-token.entity';

export enum EventType {
  SENT = 'sent',
  DELIVERED = 'delivered',
  OPENED = 'opened',
  CLICKED = 'clicked',
}

@Entity('push_statistics')
export class PushStatistics {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'push_message_id' })
  pushMessageId: number;

  @ApiProperty()
  @Column({ name: 'device_token_id', type: 'uuid' })
  deviceTokenId: string;

  @ApiProperty({ enum: EventType })
  @Column({
    name: 'event_type',
    type: 'enum',
    enum: EventType,
  })
  eventType: EventType;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => PushMessage)
  @JoinColumn({ name: 'push_message_id' })
  pushMessage: PushMessage;

  @ManyToOne(() => DeviceToken)
  @JoinColumn({ name: 'device_token_id' })
  deviceToken: DeviceToken;
}

