import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { Platform } from '../entities/device-token.entity';

export class CreateDeviceTokenDto {
  @ApiProperty({ description: 'User ID (nullable if not logged in)', required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ description: 'FCM token' })
  @IsString()
  @MaxLength(255)
  fcmToken: string;

  @ApiProperty({ enum: Platform })
  @IsEnum(Platform)
  platform: Platform;

  @ApiProperty({ description: 'App version', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  appVersion?: string;

  @ApiProperty({ description: 'Is token active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Last seen at (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  lastSeenAt?: string;
}
