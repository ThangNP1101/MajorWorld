import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppConfig } from "./entities/app-config.entity";
import { AppConfigHistory } from "./entities/app-config-history.entity";
import { UpdateAppConfigDto } from "./dto/update-app-config.dto";
import { ConfigVersionService } from "../config-version/config-version.service";
import { ModuleName } from "../config-version/entities/config-version.entity";

@Injectable()
export class AppConfigService {
  constructor(
    @InjectRepository(AppConfig)
    private appConfigRepository: Repository<AppConfig>,
    @InjectRepository(AppConfigHistory)
    private appConfigHistoryRepository: Repository<AppConfigHistory>,
    private readonly configVersionService: ConfigVersionService
  ) {}

  async getConfig(): Promise<AppConfig> {
    let config = await this.appConfigRepository.findOne({
      where: { key: "default" },
    });

    if (!config) {
      // Create default config if none exists
      config = this.appConfigRepository.create({
        key: "default",
        version: 1,
        tapMenuBg: "#9f7575",
        statusBarBg: "#000000",
        titleBarBg: "#FFFFFF",
        tapMenuTextColor: "#FFFFFF",
        titleTextColor: "#000000",
      });
      await this.appConfigRepository.save(config);
    }

    return config;
  }

  async updateConfig(updateDto: UpdateAppConfigDto): Promise<AppConfig> {
    return this.appConfigRepository.manager.transaction(async (manager) => {
      const configRepo = manager.getRepository(AppConfig);
      const historyRepo = manager.getRepository(AppConfigHistory);

      let config = await configRepo.findOne({
        where: { key: "default" },
      });

      if (!config) {
        config = configRepo.create({
          key: "default",
          version: 1,
          tapMenuBg: "#9f7575",
          statusBarBg: "#000000",
          titleBarBg: "#FFFFFF",
          tapMenuTextColor: "#FFFFFF",
          titleTextColor: "#000000",
        });
      } else {
        // Save current state to history before updating
        await historyRepo.save({
          configKey: config.key,
          version: config.version,
          tapMenuBg: config.tapMenuBg,
          statusBarBg: config.statusBarBg,
          titleBarBg: config.titleBarBg,
          tapMenuTextColor: config.tapMenuTextColor,
          titleTextColor: config.titleTextColor,
        });
        config.version += 1;
      }

      if (updateDto.tapMenuBg) config.tapMenuBg = updateDto.tapMenuBg;
      if (updateDto.statusBarBg) config.statusBarBg = updateDto.statusBarBg;
      if (updateDto.titleBarBg) config.titleBarBg = updateDto.titleBarBg;
      if (updateDto.tapMenuTextColor)
        config.tapMenuTextColor = updateDto.tapMenuTextColor;
      if (updateDto.titleTextColor)
        config.titleTextColor = updateDto.titleTextColor;

      const saved = await configRepo.save(config);

      await this.configVersionService.incrementVersion(ModuleName.APP_CONFIG);

      return saved;
    });
  }

  async rollback(toVersion: number): Promise<AppConfig> {
    return this.appConfigRepository.manager.transaction(async (manager) => {
      const configRepo = manager.getRepository(AppConfig);
      const historyRepo = manager.getRepository(AppConfigHistory);

      const config =
        (await configRepo.findOne({ where: { key: "default" } })) ||
        configRepo.create({
          key: "default",
          version: 1,
          tapMenuBg: "#9f7575",
          statusBarBg: "#000000",
          titleBarBg: "#FFFFFF",
          tapMenuTextColor: "#FFFFFF",
          titleTextColor: "#000000",
        });

      const target = await historyRepo.findOne({
        where: { configKey: "default", version: toVersion },
      });

      if (!target) {
        throw new NotFoundException(`Version ${toVersion} not found`);
      }

      // Save current state to history before rollback
      await historyRepo.save({
        configKey: config.key,
        version: config.version,
        tapMenuBg: config.tapMenuBg,
        statusBarBg: config.statusBarBg,
        titleBarBg: config.titleBarBg,
        tapMenuTextColor: config.tapMenuTextColor,
        titleTextColor: config.titleTextColor,
      });

      Object.assign(config, {
        tapMenuBg: target.tapMenuBg,
        statusBarBg: target.statusBarBg,
        titleBarBg: target.titleBarBg,
        tapMenuTextColor: target.tapMenuTextColor,
        titleTextColor: target.titleTextColor,
        version: config.version + 1,
      });

      const saved = await configRepo.save(config);

      await this.configVersionService.incrementVersion(ModuleName.APP_CONFIG);

      return saved;
    });
  }

  async getConfigVersion(): Promise<{ version: number; updatedAt: string }> {
    const config = await this.getConfig();
    return {
      version: config.version,
      updatedAt: config.updatedAt.toISOString(),
    };
  }

}
