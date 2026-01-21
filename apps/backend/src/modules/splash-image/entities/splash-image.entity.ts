import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('splash_images')
export class SplashImage {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Aspect ratio',
    example: '9:16',
    enum: ['9:16', '9:19.5', '9:20', '9:18', '9:21', '9:19'],
  })
  @Index('IDX_splash_images_aspect_ratio')
  @Column({ name: 'aspect_ratio', length: 10, unique: true })
  aspectRatio: string;

  @ApiProperty({
    description: 'Device type description',
    example: 'Regular smartphones',
  })
  @Column({ name: 'device_type', length: 50, nullable: true })
  deviceType: string;

  @ApiProperty({ description: 'Image dimensions', example: '1080 x 1920px' })
  @Column({ length: 20, nullable: true })
  dimensions: string;

  @ApiProperty({ description: 'Image URL' })
  @Column({ name: 'image_url', length: 255, nullable: true })
  imageUrl: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

