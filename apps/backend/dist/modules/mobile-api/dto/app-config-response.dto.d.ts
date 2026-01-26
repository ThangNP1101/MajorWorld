declare class ThemeDto {
    tapMenuBg: string;
    statusBarBg: string;
    titleBarBg: string;
    tapMenuTextColor: string;
    titleTextColor: string;
}
declare class MenuItemDto {
    id: number;
    name: string;
    url: string;
    iconActive: string;
    iconInactive: string;
    order: number;
}
declare class SplashDto {
    duration: number;
    images: Record<string, string>;
}
declare class PopupDto {
    enabled: boolean;
    cycleDays: number;
    imageUrl: string;
    buttonText: string;
    buttonTextColor: string;
    buttonBgColor: string;
}
declare class SocialDto {
    instagram: string;
    kakaotalk: string;
    youtube: string;
}
export declare class AppConfigResponseDto {
    theme: ThemeDto;
    menus: MenuItemDto[];
    splash: SplashDto;
    popup: PopupDto;
    social: SocialDto;
    networkErrorMessage: string;
}
export {};
