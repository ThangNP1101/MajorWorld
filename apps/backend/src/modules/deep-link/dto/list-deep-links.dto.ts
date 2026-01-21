import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListDeepLinksQueryDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ required: false, example: 'dealpang' })
  @IsOptional()
  @IsString()
  search?: string;
}
