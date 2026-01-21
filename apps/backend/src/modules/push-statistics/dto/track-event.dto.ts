import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class TrackEventDto {
  @ApiProperty({ description: 'Push message ID' })
  @IsNotEmpty()
  @IsNumber()
  pushMessageId: number;

  @ApiProperty({ description: 'Device token ID (UUID)' })
  @IsNotEmpty()
  @IsUUID()
  deviceTokenId: string;
}
