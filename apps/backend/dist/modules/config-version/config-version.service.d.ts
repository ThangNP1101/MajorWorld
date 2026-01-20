import { Repository } from "typeorm";
import { ConfigVersion, ModuleName } from "./entities/config-version.entity";
import { CacheService } from "../../common/cache/cache.service";
import { ConfigVersionsResponseDto } from "./dto/config-versions-response.dto";
export declare class ConfigVersionService {
    private configVersionRepository;
    private readonly cacheService;
    private readonly allModules;
    constructor(configVersionRepository: Repository<ConfigVersion>, cacheService: CacheService);
    getVersions(): Promise<ConfigVersionsResponseDto>;
    incrementVersion(moduleName: ModuleName): Promise<void>;
    private ensureDefaults;
}
