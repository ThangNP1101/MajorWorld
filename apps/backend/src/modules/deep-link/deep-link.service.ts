import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { DeepLink, ConnectivityType } from './entities/deep-link.entity';
import { CreateDeepLinkDto } from './dto/create-deep-link.dto';
import { ListDeepLinksQueryDto } from './dto/list-deep-links.dto';
import { DeepLinkResponseDto } from './dto/deep-link-response.dto';
import { DeepLinkListResponseDto } from './dto/deep-link-list-response.dto';

export interface RedirectResolution {
  type: 'direct' | 'html-fallback';
  url: string;
  htmlContent?: string;
}

@Injectable()
export class DeepLinkService {
  constructor(
    @InjectRepository(DeepLink)
    private deepLinkRepository: Repository<DeepLink>,
  ) {}

  async create(
    dto: CreateDeepLinkDto,
    requestHost?: string,
  ): Promise<DeepLinkResponseDto> {
    const shortCode = await this.generateUniqueShortCode();
    const entity = this.deepLinkRepository.create({
      ...dto,
      shortCode,
    });
    const saved = await this.deepLinkRepository.save(entity);
    return this.toResponse(saved, this.resolveBaseUrl(requestHost));
  }

  async findAll(
    query: ListDeepLinksQueryDto,
    requestHost?: string,
  ): Promise<DeepLinkListResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const normalizedLimit = Math.min(Math.max(limit, 1), 100);
    const offset = (page - 1) * normalizedLimit;

    const qb = this.deepLinkRepository
      .createQueryBuilder('deepLink')
      .orderBy('deepLink.createdAt', 'DESC')
      .skip(offset)
      .take(normalizedLimit);

    if (query.search) {
      qb.andWhere(
        '(deepLink.originalUrl ILIKE :search OR deepLink.shortCode ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();
    const baseUrl = this.resolveBaseUrl(requestHost);

    return {
      items: items.map((item) => this.toResponse(item, baseUrl)),
      total,
    };
  }

  async findOne(id: string, requestHost?: string): Promise<DeepLinkResponseDto> {
    const deepLink = await this.deepLinkRepository.findOne({
      where: { id },
    });

    if (!deepLink) {
      throw new NotFoundException('Deep link not found');
    }

    return this.toResponse(deepLink, this.resolveBaseUrl(requestHost));
  }

  async findByShortCode(shortCode: string): Promise<DeepLink> {
    const deepLink = await this.deepLinkRepository.findOne({
      where: { shortCode },
    });

    if (!deepLink) {
      throw new NotFoundException('Deep link not found');
    }

    return deepLink;
  }

  async remove(id: string): Promise<void> {
    const result = await this.deepLinkRepository.delete({ id });
    if (!result.affected) {
      throw new NotFoundException('Deep link not found');
    }
  }

  private async generateUniqueShortCode(): Promise<string> {
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const shortCode = this.generateShortCode(8);
      const existing = await this.deepLinkRepository.findOne({
        where: { shortCode },
        select: ['id'],
      });

      if (!existing) {
        return shortCode;
      }
    }

    throw new InternalServerErrorException('Failed to generate short code');
  }

  private generateShortCode(length: number): string {
    let code = '';
    while (code.length < length) {
      code += randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '');
    }
    return code.slice(0, length);
  }

  private toResponse(deepLink: DeepLink, baseUrl: string): DeepLinkResponseDto {
    return {
      id: deepLink.id,
      originalUrl: deepLink.originalUrl,
      connectivityType: deepLink.connectivityType,
      shortCode: deepLink.shortCode,
      shortUrl: `${baseUrl}/dl/${deepLink.shortCode}`,
      createdAt: deepLink.createdAt,
      updatedAt: deepLink.updatedAt,
    };
  }

  private resolveBaseUrl(requestHost?: string): string {
    const configured = process.env.DEEP_LINK_BASE_URL;
    if (configured) {
      return configured.replace(/\/$/, '');
    }

    if (requestHost) {
      // Extract protocol and host from request
      const hasProtocol = requestHost.startsWith('http');
      return hasProtocol ? requestHost.replace(/\/$/, '') : `https://${requestHost}`;
    }

    // Fallback
    return 'http://localhost:3001';
  }

  /**
   * Resolve redirect strategy for a deep link
   */
  resolveRedirect(
    deepLink: DeepLink,
    userAgent?: string,
  ): RedirectResolution {
    const platform = this.detectPlatform(userAgent);
    const storeUrl = this.getStoreUrl(platform);
    const appUrl = this.buildAppUrl(deepLink.originalUrl);

    // Type 1: STORE_ONLY - Direct redirect to store
    if (deepLink.connectivityType === ConnectivityType.STORE_ONLY) {
      return {
        type: 'direct',
        url: storeUrl || deepLink.originalUrl,
      };
    }

    // Determine fallback URL based on connectivity type
    const fallbackUrl =
      deepLink.connectivityType === ConnectivityType.APP_OR_STORE
        ? storeUrl || deepLink.originalUrl
        : deepLink.originalUrl;

    // If no app URL configured, direct redirect to fallback
    if (!appUrl) {
      return {
        type: 'direct',
        url: fallbackUrl,
      };
    }

    // Type 2 & 3: APP_OR_STORE / APP_OR_WEB - HTML with app scheme attempt
    return {
      type: 'html-fallback',
      url: appUrl,
      htmlContent: this.renderAppFallbackPage(appUrl, fallbackUrl),
    };
  }

  private detectPlatform(userAgent?: string): 'ios' | 'android' | 'other' {
    const ua = (userAgent || '').toLowerCase();
    if (ua.includes('android')) {
      return 'android';
    }
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
      return 'ios';
    }
    return 'other';
  }

  private getStoreUrl(platform: 'ios' | 'android' | 'other'): string | null {
    if (platform === 'ios') {
      return process.env.DEEP_LINK_IOS_STORE_URL || null;
    }
    if (platform === 'android') {
      return process.env.DEEP_LINK_ANDROID_STORE_URL || null;
    }
    return null;
  }

  private buildAppUrl(originalUrl: string): string | null {
    const template = process.env.DEEP_LINK_APP_URL_TEMPLATE;
    if (template) {
      return template.replace('{{url}}', encodeURIComponent(originalUrl));
    }

    const scheme = process.env.DEEP_LINK_APP_SCHEME;
    if (!scheme) {
      return null;
    }

    return `${scheme}://open?url=${encodeURIComponent(originalUrl)}`;
  }

  private renderAppFallbackPage(appUrl: string, fallbackUrl: string): string {
    const safeAppUrl = JSON.stringify(appUrl);
    const safeFallbackUrl = JSON.stringify(fallbackUrl);

    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Opening...</title>
    <script>
      const appUrl = ${safeAppUrl};
      const fallbackUrl = ${safeFallbackUrl};
      window.location.href = appUrl;
      setTimeout(() => {
        window.location.href = fallbackUrl;
      }, 1200);
    </script>
  </head>
  <body>
    <p>Opening the app...</p>
    <p>If nothing happens, <a href="${fallbackUrl}">continue</a>.</p>
  </body>
</html>`;
  }
}
