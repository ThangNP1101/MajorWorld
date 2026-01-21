import { ApiProperty } from '@nestjs/swagger';
import { ConnectivityType } from '../entities/deep-link.entity';

export class DeepLinkResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  originalUrl: string;

  @ApiProperty({ enum: ConnectivityType })
  connectivityType: ConnectivityType;

  @ApiProperty()
  shortCode: string;

  @ApiProperty()
  shortUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
