import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("app_configs")
export class AppConfig {
  @ApiProperty()
  @PrimaryColumn({ type: "varchar", length: 50, default: "default" })
  key: string;

  @ApiProperty()
  @Column({ default: 1 })
  version: number;

  @ApiProperty({ description: "Tab menu background color", example: "#9f7575" })
  @Column({ name: "tap_menu_bg", length: 7, default: "#FFFFFF" })
  tapMenuBg: string;

  @ApiProperty({
    description: "Status bar background color",
    example: "#000000",
  })
  @Column({ name: "status_bar_bg", length: 7, default: "#000000" })
  statusBarBg: string;

  @ApiProperty({
    description: "Title bar background color",
    example: "#FFFFFF",
  })
  @Column({ name: "title_bar_bg", length: 7, default: "#FFFFFF" })
  titleBarBg: string;

  @ApiProperty({
    description: "Tab menu text color",
    example: "#FFFFFF",
  })
  @Column({ name: "tap_menu_text_color", length: 7, default: "#FFFFFF" })
  tapMenuTextColor: string;

  @ApiProperty({
    description: "Title text color",
    example: "#000000",
  })
  @Column({ name: "title_text_color", length: 7, default: "#000000" })
  titleTextColor: string;

  @ApiProperty()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
