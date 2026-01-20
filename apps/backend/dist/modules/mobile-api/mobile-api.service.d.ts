import { Repository } from "typeorm";
import { AppConfig } from "../app-config/entities/app-config.entity";
import { BottomMenu } from "../bottom-menu/entities/bottom-menu.entity";
import { SplashImage } from "../splash-image/entities/splash-image.entity";
import { AppFeatures } from "../app-features/entities/app-features.entity";
import { AppConfigResponseDto } from "./dto/app-config-response.dto";
import { CacheService } from "../../common/cache/cache.service";
import { ConfigVersionService } from "../config-version/config-version.service";
export declare class MobileApiService {
    private appConfigRepository;
    private bottomMenuRepository;
    private splashImageRepository;
    private appFeaturesRepository;
    private readonly cacheService;
    private readonly configVersionService;
    constructor(appConfigRepository: Repository<AppConfig>, bottomMenuRepository: Repository<BottomMenu>, splashImageRepository: Repository<SplashImage>, appFeaturesRepository: Repository<AppFeatures>, cacheService: CacheService, configVersionService: ConfigVersionService);
    getAppConfig(): Promise<AppConfigResponseDto>;
    getConfigVersion(): Promise<{
        version: number;
        updatedAt: string;
    }>;
    private getOrCreateAppConfig;
    private getOrCreateAppFeatures;
}
