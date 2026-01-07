import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateBottomMenuDto {
  @ApiProperty({ description: 'Menu name', example: 'Home', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  menuName?: string;

  @ApiProperty({
    description: 'Connection URL',
    example: '/',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  connectionUrl?: string;

  @ApiProperty({ description: 'Active icon URL', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  iconActive?: string;

  @ApiProperty({ description: 'Inactive icon URL', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  iconInactive?: string;

  @ApiProperty({ description: 'Sort order', example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({ description: 'Is menu active', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

