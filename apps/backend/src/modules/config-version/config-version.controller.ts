import { Controller, Get, Header } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConfigVersionService } from "./config-version.service";
import { ConfigVersionsResponseDto } from "./dto/config-versions-response.dto";
import { Public } from "../auth/decorators/public.decorator";

@Public()
@ApiTags("Mobile API")
@Controller("v1/app")
export class ConfigVersionController {
  constructor(private readonly configVersionService: ConfigVersionService) {}

  @Get("versions")
  @ApiOperation({ summary: "Get all config versions for mobile app polling" })
  @ApiResponse({
    status: 200,
    description: "Config versions retrieved successfully",
    type: ConfigVersionsResponseDto,
  })
  @Header("Cache-Control", "public, max-age=5")
  async getVersions(): Promise<ConfigVersionsResponseDto> {
    return this.configVersionService.getVersions();
  }
}
