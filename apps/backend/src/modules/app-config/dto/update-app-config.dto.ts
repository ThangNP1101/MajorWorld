import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateAppConfigDto {
  @ApiProperty({ example: '#9f7575', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'tapMenuBg must be a valid hex color code',
  })
  tapMenuBg?: string;

  @ApiProperty({ example: '#000000', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'statusBarBg must be a valid hex color code',
  })
  statusBarBg?: string;

  @ApiProperty({ example: '#FFFFFF', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'titleBarBg must be a valid hex color code',
  })
  titleBarBg?: string;

  @ApiProperty({ example: '#FFFFFF', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'tapMenuTextColor must be a valid hex color code',
  })
  tapMenuTextColor?: string;

  @ApiProperty({ example: '#000000', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'titleTextColor must be a valid hex color code',
  })
  titleTextColor?: string;
}

