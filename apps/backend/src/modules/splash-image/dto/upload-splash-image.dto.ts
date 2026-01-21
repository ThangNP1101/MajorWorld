import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum AspectRatio {
  RATIO_9_16 = '9:16',
  RATIO_9_19_5 = '9:19.5',
  RATIO_9_20 = '9:20',
  RATIO_9_18 = '9:18',
  RATIO_9_21 = '9:21',
  RATIO_9_19 = '9:19',
}

export class UploadSplashImageDto {
  @ApiProperty({
    description: 'Aspect ratio for the splash image',
    enum: AspectRatio,
    example: AspectRatio.RATIO_9_16,
  })
  @IsNotEmpty()
  @IsEnum(AspectRatio)
  aspectRatio: AspectRatio;
}
