"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModule = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
const cache_service_1 = require("./cache.service");
const cache_tokens_1 = require("./cache.tokens");
let CacheModule = class CacheModule {
};
exports.CacheModule = CacheModule;
exports.CacheModule = CacheModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: cache_tokens_1.REDIS_CLIENT,
                useFactory: () => {
                    return new ioredis_1.default({
                        host: process.env.REDIS_HOST || "localhost",
                        port: parseInt(process.env.REDIS_PORT || "6379", 10),
                        password: process.env.REDIS_PASSWORD,
                    });
                },
            },
            cache_service_1.CacheService,
        ],
        exports: [cache_service_1.CacheService, cache_tokens_1.REDIS_CLIENT],
    })
], CacheModule);
//# sourceMappingURL=cache.module.js.map