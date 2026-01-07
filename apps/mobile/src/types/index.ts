export interface AppConfig {
  theme: {
    tapMenuBg: string;
    statusBarBg: string;
    titleBarBg: string;
  };
  menus: MenuItem[];
  splash: {
    duration: number;
    images: Record<string, string>;
  };
  popup: {
    enabled: boolean;
    cycleDays: number;
    imageUrl: string;
    buttonText: string;
    buttonTextColor: string;
    buttonBgColor: string;
  };
  social: {
    instagram: string;
    kakaotalk: string;
    youtube: string;
  };
  networkErrorMessage: string;
}

export interface MenuItem {
  id: number;
  name: string;
  url: string;
  iconActive: string;
  iconInactive: string;
  order: number;
}

