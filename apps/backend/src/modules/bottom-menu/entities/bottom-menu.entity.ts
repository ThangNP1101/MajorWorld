import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('bottom_menus')
export class BottomMenu {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Menu name', example: 'Home' })
  @Column({ name: 'menu_name', length: 50 })
  menuName: string;

  @ApiProperty({ description: 'Connection URL', example: '/' })
  @Column({ name: 'connection_url', length: 255 })
  connectionUrl: string;

  @ApiProperty({ description: 'Active icon URL' })
  @Column({ name: 'icon_active', length: 255, nullable: true })
  iconActive: string;

  @ApiProperty({ description: 'Inactive icon URL' })
  @Column({ name: 'icon_inactive', length: 255, nullable: true })
  iconInactive: string;

  @ApiProperty({ description: 'Sort order for menu display' })
  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Is menu active' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

