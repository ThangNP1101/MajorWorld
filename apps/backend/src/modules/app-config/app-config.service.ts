import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppConfig } from "./entities/app-config.entity";
import { UpdateAppConfigDto } from "./dto/update-app-config.dto";

@Injectable()
export class AppConfigService {
  constructor(
    @InjectRepository(AppConfig)
    private appConfigRepository: Repository<AppConfig>
  ) {}

  async getConfig(): Promise<AppConfig> {
    let config = await this.appConfigRepository.findOne({ where: {} });

    if (!config) {
      // Create default config if none exists
      config = this.appConfigRepository.create({
        tapMenuBg: "#9f7575",
        statusBarBg: "#000000",
        titleBarBg: "#FFFFFF",
      });
      await this.appConfigRepository.save(config);
    }

    return config;
  }

  async updateConfig(updateDto: UpdateAppConfigDto): Promise<AppConfig> {
    const config = await this.getConfig();

    if (updateDto.tapMenuBg) config.tapMenuBg = updateDto.tapMenuBg;
    if (updateDto.statusBarBg) config.statusBarBg = updateDto.statusBarBg;
    if (updateDto.titleBarBg) config.titleBarBg = updateDto.titleBarBg;

    return this.appConfigRepository.save(config);
  }
}
