import { Controller, Get, Header, Res } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Response } from "express";
import { MobileApiService } from "./mobile-api.service";
import { AppConfigResponseDto } from "./dto/app-config-response.dto";
import { Public } from "../auth/decorators/public.decorator";

@Public()
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
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
  async getConfig(
    @Res({ passthrough: true }) res: Response,
  ): Promise<AppConfigResponseDto> {
    const config = await this.mobileApiService.getAppConfig();
    const version = await this.mobileApiService.getConfigVersion();
    res.setHeader('ETag', `"v${version.version}"`);
    return config;
  }

  @Get('config/version')
  @ApiOperation({ summary: 'Get app configuration version only' })
  @ApiResponse({
    status: 200,
    description: 'App configuration version retrieved successfully',
  })
  @Header('Cache-Control', 'public, max-age=30')
  async getConfigVersion(): Promise<{ version: number; updatedAt: string }> {
    return this.mobileApiService.getConfigVersion();
  }
}

