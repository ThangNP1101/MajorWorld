import { Repository } from 'typeorm';
import { DeepLink } from './entities/deep-link.entity';
import { CreateDeepLinkDto } from './dto/create-deep-link.dto';
import { ListDeepLinksQueryDto } from './dto/list-deep-links.dto';
import { DeepLinkResponseDto } from './dto/deep-link-response.dto';
import { DeepLinkListResponseDto } from './dto/deep-link-list-response.dto';
export interface RedirectResolution {
    type: 'direct' | 'html-fallback';
    url: string;
    htmlContent?: string;
}
export declare class DeepLinkService {
    private deepLinkRepository;
    constructor(deepLinkRepository: Repository<DeepLink>);
    create(dto: CreateDeepLinkDto, requestHost?: string): Promise<DeepLinkResponseDto>;
    findAll(query: ListDeepLinksQueryDto, requestHost?: string): Promise<DeepLinkListResponseDto>;
    findOne(id: string, requestHost?: string): Promise<DeepLinkResponseDto>;
    findByShortCode(shortCode: string): Promise<DeepLink>;
    remove(id: string): Promise<void>;
    private generateUniqueShortCode;
    private generateShortCode;
    private toResponse;
    private resolveBaseUrl;
    resolveRedirect(deepLink: DeepLink, userAgent?: string): RedirectResolution;
    private detectPlatform;
    private getStoreUrl;
    private buildAppUrl;
    private renderAppFallbackPage;
}
