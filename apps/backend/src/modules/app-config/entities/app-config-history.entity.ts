import { ApiProperty } from "@nestjs/swagger";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("app_config_history")
export class AppConfigHistory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "Key of the config this history entry belongs to" })
  @Column({ name: "config_key", length: 50 })
  configKey: string;

  @ApiProperty({ description: "Version number of the config" })
  @Column()
  version: number;

  @ApiProperty({ description: "Tab menu background color" })
  @Column({ name: "tap_menu_bg", length: 7 })
  tapMenuBg: string;

  @ApiProperty({ description: "Status bar background color" })
  @Column({ name: "status_bar_bg", length: 7 })
  statusBarBg: string;

  @ApiProperty({ description: "Title bar background color" })
  @Column({ name: "title_bar_bg", length: 7 })
  titleBarBg: string;

  @ApiProperty({ description: "Tab menu text color" })
  @Column({ name: "tap_menu_text_color", length: 7 })
  tapMenuTextColor: string;

  @ApiProperty({ description: "Title text color" })
  @Column({ name: "title_text_color", length: 7 })
  titleTextColor: string;

  @ApiProperty()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}