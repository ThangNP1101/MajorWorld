"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepLinkService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const deep_link_entity_1 = require("./entities/deep-link.entity");
let DeepLinkService = class DeepLinkService {
    constructor(deepLinkRepository) {
        this.deepLinkRepository = deepLinkRepository;
    }
    async create(dto, requestHost) {
        const shortCode = await this.generateUniqueShortCode();
        const entity = this.deepLinkRepository.create({
            ...dto,
            shortCode,
        });
        const saved = await this.deepLinkRepository.save(entity);
        return this.toResponse(saved, this.resolveBaseUrl(requestHost));
    }
    async findAll(query, requestHost) {
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
            qb.andWhere('(deepLink.originalUrl ILIKE :search OR deepLink.shortCode ILIKE :search)', { search: `%${query.search}%` });
        }
        const [items, total] = await qb.getManyAndCount();
        const baseUrl = this.resolveBaseUrl(requestHost);
        return {
            items: items.map((item) => this.toResponse(item, baseUrl)),
            total,
        };
    }
    async findOne(id, requestHost) {
        const deepLink = await this.deepLinkRepository.findOne({
            where: { id },
        });
        if (!deepLink) {
            throw new common_1.NotFoundException('Deep link not found');
        }
        return this.toResponse(deepLink, this.resolveBaseUrl(requestHost));
    }
    async findByShortCode(shortCode) {
        const deepLink = await this.deepLinkRepository.findOne({
            where: { shortCode },
        });
        if (!deepLink) {
            throw new common_1.NotFoundException('Deep link not found');
        }
        return deepLink;
    }
    async remove(id) {
        const result = await this.deepLinkRepository.delete({ id });
        if (!result.affected) {
            throw new common_1.NotFoundException('Deep link not found');
        }
    }
    async generateUniqueShortCode() {
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
        throw new common_1.InternalServerErrorException('Failed to generate short code');
    }
    generateShortCode(length) {
        let code = '';
        while (code.length < length) {
            code += (0, crypto_1.randomBytes)(length)
                .toString('base64')
                .replace(/[^a-zA-Z0-9]/g, '');
        }
        return code.slice(0, length);
    }
    toResponse(deepLink, baseUrl) {
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
    resolveBaseUrl(requestHost) {
        const configured = process.env.DEEP_LINK_BASE_URL;
        if (configured) {
            return configured.replace(/\/$/, '');
        }
        if (requestHost) {
            const hasProtocol = requestHost.startsWith('http');
            return hasProtocol ? requestHost.replace(/\/$/, '') : `https://${requestHost}`;
        }
        return 'http://localhost:3001';
    }
    resolveRedirect(deepLink, userAgent) {
        const platform = this.detectPlatform(userAgent);
        const storeUrl = this.getStoreUrl(platform);
        const appUrl = this.buildAppUrl(deepLink.originalUrl);
        if (deepLink.connectivityType === deep_link_entity_1.ConnectivityType.STORE_ONLY) {
            return {
                type: 'direct',
                url: storeUrl || deepLink.originalUrl,
            };
        }
        const fallbackUrl = deepLink.connectivityType === deep_link_entity_1.ConnectivityType.APP_OR_STORE
            ? storeUrl || deepLink.originalUrl
            : deepLink.originalUrl;
        if (!appUrl) {
            return {
                type: 'direct',
                url: fallbackUrl,
            };
        }
        return {
            type: 'html-fallback',
            url: appUrl,
            htmlContent: this.renderAppFallbackPage(appUrl, fallbackUrl),
        };
    }
    detectPlatform(userAgent) {
        const ua = (userAgent || '').toLowerCase();
        if (ua.includes('android')) {
            return 'android';
        }
        if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
            return 'ios';
        }
        return 'other';
    }
    getStoreUrl(platform) {
        if (platform === 'ios') {
            return process.env.DEEP_LINK_IOS_STORE_URL || null;
        }
        if (platform === 'android') {
            return process.env.DEEP_LINK_ANDROID_STORE_URL || null;
        }
        return null;
    }
    buildAppUrl(originalUrl) {
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
    renderAppFallbackPage(appUrl, fallbackUrl) {
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
};
exports.DeepLinkService = DeepLinkService;
exports.DeepLinkService = DeepLinkService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deep_link_entity_1.DeepLink)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DeepLinkService);
//# sourceMappingURL=deep-link.service.js.map