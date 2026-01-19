import { ApiProperty } from "@nestjs/swagger";

export class ConfigVersionsModulesDto {
  @ApiProperty({ example: 5 })
  appConfig: number;

  @ApiProperty({ example: 3 })
  bottomMenu: number;

  @ApiProperty({ example: 2 })
  splashImage: number;

  @ApiProperty({ example: 4 })
  appFeatures: number;
}

export class ConfigVersionsResponseDto {
  @ApiProperty({ example: 10 })
  globalVersion: number;

  @ApiProperty({ example: "2026-01-16T10:30:00.000Z" })
  lastUpdatedAt: string;

  @ApiProperty({ type: ConfigVersionsModulesDto })
  modules: ConfigVersionsModulesDto;
}
