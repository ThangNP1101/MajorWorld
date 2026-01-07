import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PushTarget, SendType } from '../entities/push-message.entity';

export class CreatePushMessageDto {
  @ApiProperty({ description: 'Push notification title', example: 'New Product Alert' })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Android message content',
    example: 'Check out our new products!',
    required: false,
  })
  @IsOptional()
  @IsString()
  androidMessage?: string;

  @ApiProperty({
    description: 'Android big text (expanded content)',
    example: 'Details that will appear when the user expands the notification.',
    required: false,
  })
  @IsOptional()
  @IsString()
  androidBigtext?: string;

  @ApiProperty({
    description: 'iOS message content',
    example: 'Check out our new products!',
    required: false,
  })
  @IsOptional()
  @IsString()
  iosMessage?: string;

  @ApiProperty({
    description: 'Push notification image URL (800x464 recommended)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageUrl?: string;

  @ApiProperty({
    description: 'Landing URL (deep link)',
    example: 'myapp://products/123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  landingUrl?: string;

  @ApiProperty({
    enum: PushTarget,
    description: 'Target audience',
    default: PushTarget.ALL,
  })
  @IsEnum(PushTarget)
  target: PushTarget;

  @ApiProperty({
    enum: SendType,
    description: 'Send type',
    default: SendType.IMMEDIATE,
  })
  @IsEnum(SendType)
  sendType: SendType;

  @ApiProperty({
    description: 'Scheduled date and time (ISO string)',
    required: false,
  })
  @ValidateIf((o) => o.sendType === SendType.SCHEDULED)
  @IsDateString()
  scheduledAt?: string;
}

