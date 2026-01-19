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

export class UpdatePushMessageDto {
  @ApiProperty({ description: 'Push notification title', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    description: 'Android message content',
    required: false,
  })
  @IsOptional()
  @IsString()
  androidMessage?: string;

  @ApiProperty({
    description: 'Android big text (expanded content)',
    required: false,
  })
  @IsOptional()
  @IsString()
  androidBigtext?: string;

  @ApiProperty({
    description: 'iOS message content',
    required: false,
  })
  @IsOptional()
  @IsString()
  iosMessage?: string;

  @ApiProperty({
    description: 'Push notification image URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageUrl?: string;

  @ApiProperty({
    description: 'Landing URL (deep link)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  landingUrl?: string;

  @ApiProperty({
    enum: PushTarget,
    description: 'Target audience',
    required: false,
  })
  @IsOptional()
  @IsEnum(PushTarget)
  target?: PushTarget;

  @ApiProperty({
    enum: SendType,
    description: 'Send type',
    required: false,
  })
  @IsOptional()
  @IsEnum(SendType)
  sendType?: SendType;

  @ApiProperty({
    description: 'Scheduled date and time (ISO string)',
    required: false,
  })
  @ValidateIf((o) => o.sendType === SendType.SCHEDULED)
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}



