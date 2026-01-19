import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  Matches,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class UpdateAppFeaturesDto {
  @ApiProperty({ example: 2, description: 'Splash screen duration in seconds', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  splashDuration?: number;

  @ApiProperty({ example: true, description: 'Enable popup', required: false })
  @IsOptional()
  @IsBoolean()
  popupEnabled?: boolean;

  @ApiProperty({ example: 7, description: 'Popup exposure cycle in days', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  popupCycleDays?: number;

  @ApiProperty({ example: 'Sign up for alerts', description: 'Popup button text', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  popupButtonText?: string;

  @ApiProperty({ example: '#FFFFFF', description: 'Popup button text color', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'popupButtonTextColor must be a valid hex color code',
  })
  popupButtonTextColor?: string;

  @ApiProperty({ example: '#000000', description: 'Popup button background color', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'popupButtonBgColor must be a valid hex color code',
  })
  popupButtonBgColor?: string;

  @ApiProperty({ example: 'https://instagram.com/...', description: 'Instagram URL', required: false })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'instagramUrl must be a valid URL' })
  @MaxLength(255)
  instagramUrl?: string;

  @ApiProperty({ example: 'https://pf.kakao.com/...', description: 'KakaoTalk channel URL', required: false })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'kakaotalkUrl must be a valid URL' })
  @MaxLength(255)
  kakaotalkUrl?: string;

  @ApiProperty({ example: 'https://youtube.com/@...', description: 'YouTube channel URL', required: false })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'youtubeUrl must be a valid URL' })
  @MaxLength(255)
  youtubeUrl?: string;

  @ApiProperty({ example: 'Please check your internet connection', description: 'Network error message', required: false })
  @IsOptional()
  @IsString()
  networkErrorMessage?: string;
}
