import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class RollbackAppConfigDto {
  @ApiProperty({ example: 1, description: "Version to rollback to" })
  @IsInt()
  @Min(1)
  version: number;
}
