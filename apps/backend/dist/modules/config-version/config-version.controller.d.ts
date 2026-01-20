import { ConfigVersionService } from "./config-version.service";
import { ConfigVersionsResponseDto } from "./dto/config-versions-response.dto";
export declare class ConfigVersionController {
    private readonly configVersionService;
    constructor(configVersionService: ConfigVersionService);
    getVersions(): Promise<ConfigVersionsResponseDto>;
}
