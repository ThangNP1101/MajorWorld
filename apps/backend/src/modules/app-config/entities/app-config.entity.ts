import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity("app_configs")
export class AppConfig {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

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

  @ApiProperty()
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
