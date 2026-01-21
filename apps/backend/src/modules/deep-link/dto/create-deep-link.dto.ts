import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUrl, MaxLength } from 'class-validator';
import { ConnectivityType } from '../entities/deep-link.entity';

export class CreateDeepLinkDto {
  @ApiProperty({
    description: 'Original web URL',
    example: 'https://www.example.com/products/123',
  })
  @IsString()
  @IsUrl({}, { message: 'originalUrl must be a valid URL' })
  @MaxLength(2048)
  originalUrl: string;

  @ApiProperty({
    enum: ConnectivityType,
    example: ConnectivityType.APP_OR_STORE,
  })
  @IsEnum(ConnectivityType)
  connectivityType: ConnectivityType;
}
