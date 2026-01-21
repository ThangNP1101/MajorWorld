import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum ConnectivityType {
  STORE_ONLY = 'store_only',
  APP_OR_STORE = 'app_or_store',
  APP_OR_WEB = 'app_or_web',
}

@Entity('deep_links')
export class DeepLink {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Original web URL' })
  @Column({ name: 'original_url', length: 2048 })
  originalUrl: string;

  @ApiProperty({ enum: ConnectivityType })
  @Column({
    name: 'connectivity_type',
    type: 'enum',
    enum: ConnectivityType,
    enumName: 'deep_links_connectivity_type_enum',
  })
  connectivityType: ConnectivityType;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ name: 'short_code', length: 16 })
  shortCode: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
