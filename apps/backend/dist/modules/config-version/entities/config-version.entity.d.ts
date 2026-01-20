export declare enum ModuleName {
    GLOBAL = "global",
    APP_CONFIG = "app_config",
    BOTTOM_MENU = "bottom_menu",
    SPLASH_IMAGE = "splash_image",
    APP_FEATURES = "app_features"
}
export declare class ConfigVersion {
    moduleName: ModuleName;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}
