import { AppConfigService } from "./app-config.service";
import { UpdateAppConfigDto } from "./dto/update-app-config.dto";
import { AppConfig } from "./entities/app-config.entity";
import { RollbackAppConfigDto } from "./dto/rollback-app-config.dto";
export declare class AppConfigController {
    private readonly appConfigService;
    constructor(appConfigService: AppConfigService);
    getConfig(): Promise<AppConfig>;
    getConfigVersion(): Promise<{
        version: number;
        updatedAt: string;
    }>;
    updateColors(updateDto: UpdateAppConfigDto): Promise<AppConfig>;
    rollback(rollbackDto: RollbackAppConfigDto): Promise<AppConfig>;
}
