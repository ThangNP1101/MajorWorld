import { Repository } from "typeorm";
import { AppConfig } from "./entities/app-config.entity";
import { AppConfigHistory } from "./entities/app-config-history.entity";
import { UpdateAppConfigDto } from "./dto/update-app-config.dto";
import { ConfigVersionService } from "../config-version/config-version.service";
export declare class AppConfigService {
    private appConfigRepository;
    private appConfigHistoryRepository;
    private readonly configVersionService;
    constructor(appConfigRepository: Repository<AppConfig>, appConfigHistoryRepository: Repository<AppConfigHistory>, configVersionService: ConfigVersionService);
    getConfig(): Promise<AppConfig>;
    updateConfig(updateDto: UpdateAppConfigDto): Promise<AppConfig>;
    rollback(toVersion: number): Promise<AppConfig>;
    getConfigVersion(): Promise<{
        version: number;
        updatedAt: string;
    }>;
}
