import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import {
  ConfigVersion,
  ModuleName,
} from "./entities/config-version.entity";
import { CacheService } from "../../common/cache/cache.service";
import { CACHE_KEYS } from "../../common/cache/cache.constants";
import { ConfigVersionsResponseDto } from "./dto/config-versions-response.dto";

@Injectable()
export class ConfigVersionService {
  private readonly allModules: ModuleName[] = [
    ModuleName.GLOBAL,
    ModuleName.APP_CONFIG,
    ModuleName.BOTTOM_MENU,
    ModuleName.SPLASH_IMAGE,
    ModuleName.APP_FEATURES,
  ];

  constructor(
    @InjectRepository(ConfigVersion)
    private configVersionRepository: Repository<ConfigVersion>,
    private readonly cacheService: CacheService
  ) {}

  async getVersions(): Promise<ConfigVersionsResponseDto> {
    const cached = await this.cacheService.get<ConfigVersionsResponseDto>(
      CACHE_KEYS.CONFIG_VERSIONS
    );
    if (cached) {
      return cached;
    }

    await this.ensureDefaults(this.allModules);
    const versions = await this.configVersionRepository.find();
    const versionMap = new Map(versions.map((v) => [v.moduleName, v]));

    const global = versionMap.get(ModuleName.GLOBAL);
    const response: ConfigVersionsResponseDto = {
      globalVersion: global?.version ?? 1,
      lastUpdatedAt:
        global?.updatedAt?.toISOString() ?? new Date().toISOString(),
      modules: {
        appConfig: versionMap.get(ModuleName.APP_CONFIG)?.version ?? 1,
        bottomMenu: versionMap.get(ModuleName.BOTTOM_MENU)?.version ?? 1,
        splashImage: versionMap.get(ModuleName.SPLASH_IMAGE)?.version ?? 1,
        appFeatures: versionMap.get(ModuleName.APP_FEATURES)?.version ?? 1,
      },
    };

    await this.cacheService.set(CACHE_KEYS.CONFIG_VERSIONS, response, 30);
    return response;
  }

  async incrementVersion(moduleName: ModuleName): Promise<void> {
    await this.ensureDefaults([moduleName, ModuleName.GLOBAL]);

    await this.configVersionRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(ConfigVersion);

      await repo
        .createQueryBuilder()
        .update(ConfigVersion)
        .set({
          version: () => '"version" + 1',
          updatedAt: () => "CURRENT_TIMESTAMP",
        })
        .where('"module_name" = :moduleName', { moduleName })
        .execute();

      await repo
        .createQueryBuilder()
        .update(ConfigVersion)
        .set({
          version: () => '"version" + 1',
          updatedAt: () => "CURRENT_TIMESTAMP",
        })
        .where('"module_name" = :moduleName', {
          moduleName: ModuleName.GLOBAL,
        })
        .execute();
    });

    await this.cacheService.invalidate([
      CACHE_KEYS.CONFIG_VERSIONS,
      CACHE_KEYS.APP_CONFIG,
      CACHE_KEYS.APP_CONFIG_VERSION,
    ]);
  }

  private async ensureDefaults(modules: ModuleName[]): Promise<void> {
    const existing = await this.configVersionRepository.find({
      where: { moduleName: In(modules) },
    });
    const existingSet = new Set(existing.map((v) => v.moduleName));
    const missing = modules.filter((module) => !existingSet.has(module));
    if (missing.length === 0) {
      return;
    }

    const toCreate = missing.map((moduleName) =>
      this.configVersionRepository.create({ moduleName, version: 1 })
    );
    await this.configVersionRepository.save(toCreate);
  }
}
