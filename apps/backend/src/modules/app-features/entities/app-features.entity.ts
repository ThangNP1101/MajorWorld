import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('app_features')
export class AppFeatures {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Splash screen duration in seconds', example: 2 })
  @Column({ name: 'splash_duration', default: 2 })
  splashDuration: number;

  @ApiProperty({ description: 'Enable popup' })
  @Column({ name: 'popup_enabled', default: true })
  popupEnabled: boolean;

  @ApiProperty({ description: 'Popup exposure cycle in days', example: 7 })
  @Column({ name: 'popup_cycle_days', default: 7 })
  popupCycleDays: number;

  @ApiProperty({ description: 'Popup marketing image URL' })
  @Column({ name: 'popup_image_url', length: 255, nullable: true })
  popupImageUrl: string;

  @ApiProperty({ description: 'Popup button text', example: 'Sign up for alerts' })
  @Column({ name: 'popup_button_text', length: 50, nullable: true })
  popupButtonText: string;

  @ApiProperty({ description: 'Popup button text color', example: '#FFFFFF' })
  @Column({ name: 'popup_button_text_color', length: 7, default: '#FFFFFF' })
  popupButtonTextColor: string;

  @ApiProperty({
    description: 'Popup button background color',
    example: '#000000',
  })
  @Column({ name: 'popup_button_bg_color', length: 7, default: '#000000' })
  popupButtonBgColor: string;

  @ApiProperty({ description: 'Instagram URL' })
  @Column({ name: 'instagram_url', length: 255, nullable: true })
  instagramUrl: string;

  @ApiProperty({ description: 'KakaoTalk channel URL' })
  @Column({ name: 'kakaotalk_url', length: 255, nullable: true })
  kakaotalkUrl: string;

  @ApiProperty({ description: 'YouTube channel URL' })
  @Column({ name: 'youtube_url', length: 255, nullable: true })
  youtubeUrl: string;

  @ApiProperty({ description: 'Network error message' })
  @Column({ name: 'network_error_message', type: 'text', nullable: true })
  networkErrorMessage: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

