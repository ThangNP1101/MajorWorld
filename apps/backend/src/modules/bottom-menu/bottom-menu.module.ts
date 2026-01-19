import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BottomMenu } from "./entities/bottom-menu.entity";
import { BottomMenuService } from "./bottom-menu.service";
import { BottomMenuController } from "./bottom-menu.controller";
import { UploadModule } from "../upload/upload.module";
import { CacheModule } from "../../common/cache/cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([BottomMenu]), UploadModule, CacheModule],
  controllers: [BottomMenuController],
  providers: [BottomMenuService],
  exports: [BottomMenuService],
})
export class BottomMenuModule {}
