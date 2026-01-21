import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class SendTestPushDto {
  @ApiProperty({
    description: 'Array of test device token IDs to send test push to',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  deviceTokenIds: string[];
}



