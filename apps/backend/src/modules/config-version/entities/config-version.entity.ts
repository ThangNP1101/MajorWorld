import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export enum ModuleName {
  GLOBAL = "global",
  APP_CONFIG = "app_config",
  BOTTOM_MENU = "bottom_menu",
  SPLASH_IMAGE = "splash_image",
  APP_FEATURES = "app_features",
}

@Entity("config_versions")
export class ConfigVersion {
  @ApiProperty()
  @PrimaryColumn({ name: "module_name", type: "varchar", length: 50 })
  moduleName: ModuleName;

  @ApiProperty()
  @Column({ default: 1 })
  version: number;

  @ApiProperty()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
