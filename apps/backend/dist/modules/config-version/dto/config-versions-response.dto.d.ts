export declare class ConfigVersionsModulesDto {
    appConfig: number;
    bottomMenu: number;
    splashImage: number;
    appFeatures: number;
}
export declare class ConfigVersionsResponseDto {
    globalVersion: number;
    lastUpdatedAt: string;
    modules: ConfigVersionsModulesDto;
}
