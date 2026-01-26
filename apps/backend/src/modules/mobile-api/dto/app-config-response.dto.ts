import { ApiProperty } from '@nestjs/swagger';

class ThemeDto {
  @ApiProperty()
  tapMenuBg: string;

  @ApiProperty()
  statusBarBg: string;

  @ApiProperty()
  titleBarBg: string;

  @ApiProperty()
  tapMenuTextColor: string;

  @ApiProperty()
  titleTextColor: string;
}

class MenuItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  iconActive: string;

  @ApiProperty()
  iconInactive: string;

  @ApiProperty()
  order: number;
}

class SplashDto {
  @ApiProperty()
  duration: number;

  @ApiProperty()
  images: Record<string, string>;
}

class PopupDto {
  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  cycleDays: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  buttonText: string;

  @ApiProperty()
  buttonTextColor: string;

  @ApiProperty()
  buttonBgColor: string;
}

class SocialDto {
  @ApiProperty()
  instagram: string;

  @ApiProperty()
  kakaotalk: string;

  @ApiProperty()
  youtube: string;
}

export class AppConfigResponseDto {
  @ApiProperty({ type: ThemeDto })
  theme: ThemeDto;

  @ApiProperty({ type: [MenuItemDto] })
  menus: MenuItemDto[];

  @ApiProperty({ type: SplashDto })
  splash: SplashDto;

  @ApiProperty({ type: PopupDto })
  popup: PopupDto;

  @ApiProperty({ type: SocialDto })
  social: SocialDto;

  @ApiProperty()
  networkErrorMessage: string;
}

