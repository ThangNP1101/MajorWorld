import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeviceTokenService } from './device-token.service';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
import { RegisterDeviceTokenResponseDto } from './dto/register-device-token-response.dto';
import { Public } from '../auth/decorators/public.decorator';

/** Handles mobile device token registration. */
@ApiTags('Mobile - Device Token')
@Controller('v1/app/device-token')
export class DeviceTokenMobileController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}

  /** Registers a device token and schedules async topic sync. */
  @Post()
  @Public()
  @ApiOperation({
    summary: 'Register device token for push notifications',
    description: 'Register or update FCM token. Can be called with or without authentication.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Device token registered successfully',
    type: RegisterDeviceTokenResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async registerToken(
    @Body() registerDto: RegisterDeviceTokenDto,
  ): Promise<RegisterDeviceTokenResponseDto> {
    const token = await this.deviceTokenService.registerToken(registerDto);
    return { success: true, deviceTokenId: token.id };
  }
}
