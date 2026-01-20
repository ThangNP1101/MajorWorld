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
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const cache_constants_1 = require("./cache.constants");
const cache_tokens_1 = require("./cache.tokens");
let CacheService = CacheService_1 = class CacheService {
    constructor(redis) {
        this.redis = redis;
        this.logger = new common_1.Logger(CacheService_1.name);
    }
    async get(key) {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            this.logger.warn(`Cache get failed for key ${key}: ${error?.message}`);
            return null;
        }
    }
    async set(key, value, ttlSeconds = cache_constants_1.DEFAULT_CACHE_TTL_SECONDS) {
        try {
            await this.redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
        }
        catch (error) {
            this.logger.warn(`Cache set failed for key ${key}: ${error?.message}`);
        }
    }
    async setVersion(value) {
        return this.set(cache_constants_1.CACHE_KEYS.APP_CONFIG_VERSION, value, cache_constants_1.VERSION_CACHE_TTL_SECONDS);
    }
    async invalidate(keys) {
        const targets = Array.isArray(keys) ? keys : [keys];
        try {
            if (targets.length === 1) {
                await this.redis.del(targets[0]);
            }
            else {
                await this.redis.del(...targets);
            }
        }
        catch (error) {
            this.logger.warn(`Cache invalidate failed for keys [${targets.join(",")}]: ${error?.message}`);
        }
    }
    async onModuleDestroy() {
        try {
            await this.redis.quit();
        }
        catch (error) {
            this.logger.warn(`Redis quit failed: ${error?.message}`);
        }
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_tokens_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.Redis])
], CacheService);
//# sourceMappingURL=cache.service.js.map