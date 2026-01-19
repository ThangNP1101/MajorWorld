import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheModule } from "../../common/cache/cache.module";
import { ConfigVersion } from "./entities/config-version.entity";
import { ConfigVersionService } from "./config-version.service";
import { ConfigVersionController } from "./config-version.controller";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ConfigVersion]), CacheModule],
  providers: [ConfigVersionService],
  controllers: [ConfigVersionController],
  exports: [ConfigVersionService],
})
export class ConfigVersionModule {}
