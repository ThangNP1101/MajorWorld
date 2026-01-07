import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class SendTestPushDto {
  @ApiProperty({
    description: 'Array of device token IDs to send test push to',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  deviceTokenIds: number[];
}

