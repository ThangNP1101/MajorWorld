import { Inject, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
import {
  CACHE_KEYS,
  DEFAULT_CACHE_TTL_SECONDS,
  VERSION_CACHE_TTL_SECONDS,
} from "./cache.constants";
import { REDIS_CLIENT } from "./cache.tokens";

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      this.logger.warn(`Cache get failed for key ${key}: ${error?.message}`);
      return null;
    }
  }

  async set(
    key: string,
    value: unknown,
    ttlSeconds = DEFAULT_CACHE_TTL_SECONDS
  ): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch (error) {
      this.logger.warn(`Cache set failed for key ${key}: ${error?.message}`);
    }
  }

  async setVersion(value: unknown): Promise<void> {
    return this.set(CACHE_KEYS.APP_CONFIG_VERSION, value, VERSION_CACHE_TTL_SECONDS);
  }

  async invalidate(keys: string | string[]): Promise<void> {
    const targets = Array.isArray(keys) ? keys : [keys];
    try {
      if (targets.length === 1) {
        await this.redis.del(targets[0]);
      } else {
        await this.redis.del(...targets);
      }
    } catch (error) {
      this.logger.warn(
        `Cache invalidate failed for keys [${targets.join(",")}]: ${error?.message}`
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      this.logger.warn(`Redis quit failed: ${error?.message}`);
    }
  }
}
