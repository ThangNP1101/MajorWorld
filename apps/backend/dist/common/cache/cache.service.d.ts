import { OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
export declare class CacheService implements OnModuleDestroy {
    private readonly redis;
    private readonly logger;
    constructor(redis: Redis);
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
    setVersion(value: unknown): Promise<void>;
    invalidate(keys: string | string[]): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
