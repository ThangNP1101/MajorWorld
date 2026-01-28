import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Platform } from '../entities/device-token.entity';

/**
 * DTO for mobile device token registration
 * Used by mobile apps to register FCM tokens for push notifications
 */
export class RegisterDeviceTokenDto {
  @ApiProperty({ description: 'FCM token from Firebase' })
  @IsString()
  @MaxLength(255)
  fcmToken: string;

  @ApiProperty({ enum: Platform, description: 'Device platform (ios/android)' })
  @IsEnum(Platform)
  platform: Platform;

  @ApiProperty({ description: 'App version', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  appVersion?: string;
}
