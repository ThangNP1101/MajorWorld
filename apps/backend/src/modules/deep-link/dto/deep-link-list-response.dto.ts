import { ApiProperty } from '@nestjs/swagger';
import { DeepLinkResponseDto } from './deep-link-response.dto';

export class DeepLinkListResponseDto {
  @ApiProperty({ type: [DeepLinkResponseDto] })
  items: DeepLinkResponseDto[];

  @ApiProperty()
  total: number;
}
