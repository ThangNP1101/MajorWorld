export declare enum ConnectivityType {
    STORE_ONLY = "store_only",
    APP_OR_STORE = "app_or_store",
    APP_OR_WEB = "app_or_web"
}
export declare class DeepLink {
    id: string;
    originalUrl: string;
    connectivityType: ConnectivityType;
    shortCode: string;
    createdAt: Date;
    updatedAt: Date;
}
