import { Module } from "@nestjs/common";
import Redis from "ioredis";
import { CacheService } from "./cache.service";
import { REDIS_CLIENT } from "./cache.tokens";

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST || "localhost",
          port: parseInt(process.env.REDIS_PORT || "6379", 10),
          password: process.env.REDIS_PASSWORD,
        });
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
