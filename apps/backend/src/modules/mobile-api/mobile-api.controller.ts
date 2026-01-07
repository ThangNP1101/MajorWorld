import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MobileApiService } from './mobile-api.service';
import { AppConfigResponseDto } from './dto/app-config-response.dto';

@ApiTags('Mobile API')
@Controller('v1/app')
export class MobileApiController {
  constructor(private readonly mobileApiService: MobileApiService) {}

  @Get('config')
  @ApiOperation({ summary: 'Get app configuration for mobile app' })
  @ApiResponse({
    status: 200,
    description: 'App configuration retrieved successfully',
    type: AppConfigResponseDto,
  })
  async getConfig(): Promise<AppConfigResponseDto> {
    return this.mobileApiService.getAppConfig();
  }
}

