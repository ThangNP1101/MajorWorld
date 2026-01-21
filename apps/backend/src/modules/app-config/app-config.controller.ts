import { Controller, Get, Put, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { AppConfigService } from "./app-config.service";
import { UpdateAppConfigDto } from "./dto/update-app-config.dto";
import { AppConfig } from "./entities/app-config.entity";
import { RollbackAppConfigDto } from "./dto/rollback-app-config.dto";

@ApiTags("Admin - App Config")
@ApiBearerAuth()
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

  @Get("version")
  @ApiOperation({ summary: "Get app design configuration version" })
  @ApiResponse({
    status: 200,
    description: "Configuration version retrieved successfully",
    schema: {
      type: "object",
      properties: {
        version: { type: "number" },
        updatedAt: { type: "string", format: "date-time" },
      },
      example: { version: 1, updatedAt: "2024-01-01T00:00:00.000Z" },
    },
  })
  async getConfigVersion(): Promise<{ version: number; updatedAt: string }> {
    return this.appConfigService.getConfigVersion();
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

  @Put("rollback")
  @ApiOperation({ summary: "Rollback app theme to a previous version" })
  @ApiResponse({
    status: 200,
    description: "Rollback completed successfully",
    type: AppConfig,
  })
  async rollback(
    @Body() rollbackDto: RollbackAppConfigDto
  ): Promise<AppConfig> {
    return this.appConfigService.rollback(rollbackDto.version);
  }
}
