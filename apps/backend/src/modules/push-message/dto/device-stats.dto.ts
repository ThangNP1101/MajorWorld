import { ApiProperty } from '@nestjs/swagger';

export class DeviceStatsDto {
  @ApiProperty({ description: 'Total active devices', example: 15234 })
  total: number;

  @ApiProperty({ description: 'Active Android devices', example: 9876 })
  android: number;

  @ApiProperty({ description: 'Active iOS devices', example: 5358 })
  ios: number;
}



