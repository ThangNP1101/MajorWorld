import { ApiProperty } from '@nestjs/swagger';

/** Response payload for device token registration. */
export class RegisterDeviceTokenResponseDto {
  @ApiProperty({ description: 'Operation success flag' })
  success: boolean;

  @ApiProperty({ description: 'Device token ID' })
  deviceTokenId: string;
}
