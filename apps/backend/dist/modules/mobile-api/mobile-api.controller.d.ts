import { Response } from "express";
import { MobileApiService } from "./mobile-api.service";
import { AppConfigResponseDto } from "./dto/app-config-response.dto";
export declare class MobileApiController {
    private readonly mobileApiService;
    constructor(mobileApiService: MobileApiService);
    getConfig(res: Response): Promise<AppConfigResponseDto>;
    getConfigVersion(): Promise<{
        version: number;
        updatedAt: string;
    }>;
}
