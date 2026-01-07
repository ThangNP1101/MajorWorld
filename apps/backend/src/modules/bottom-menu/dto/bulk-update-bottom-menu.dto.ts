import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  Min,
} from 'class-validator';

export class MenuItemDto {
  @ApiProperty({ description: 'Menu ID (optional for new items)', required: false })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: 'Menu name', example: 'Home' })
  @IsString()
  @MaxLength(50)
  menuName: string;

  @ApiProperty({ description: 'Connection URL', example: '/' })
  @IsString()
  @MaxLength(255)
  connectionUrl: string;

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

  @ApiProperty({ description: 'Sort order', example: 1 })
  @IsNumber()
  @Min(0)
  sortOrder: number;

  @ApiProperty({ description: 'Is menu active', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class BulkUpdateBottomMenuDto {
  @ApiProperty({
    description: 'Array of menu items',
    type: [MenuItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  menus: MenuItemDto[];
}

