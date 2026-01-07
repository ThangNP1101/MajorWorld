import { Controller, Get, Put, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AppConfigService } from "./app-config.service";
import { UpdateAppConfigDto } from "./dto/update-app-config.dto";
import { AppConfig } from "./entities/app-config.entity";

@ApiTags("Admin - App Config")
@Controller("admin/app-design")
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get()
  @ApiOperation({ summary: "Get app design configuration" })
  @ApiResponse({
    status: 200,
    description: "Configuration retrieved successfully",
    type: AppConfig,
  })
  async getConfig(): Promise<AppConfig> {
    return this.appConfigService.getConfig();
  }

  @Put("colors")
  @ApiOperation({ summary: "Update app theme colors" })
  @ApiResponse({
    status: 200,
    description: "Colors updated successfully",
    type: AppConfig,
  })
  async updateColors(
    @Body() updateDto: UpdateAppConfigDto
  ): Promise<AppConfig> {
    return this.appConfigService.updateConfig(updateDto);
  }
}
