import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DATABASE_HOST', 'localhost'),
      port: this.configService.get('DATABASE_PORT', 5432),
      username: this.configService.get('DATABASE_USER', 'majorworld'),
      password: this.configService.get('DATABASE_PASSWORD', 'majorworld123'),
      database: this.configService.get('DATABASE_NAME', 'majorworld'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false, // Use migrations in production
      logging: this.configService.get('NODE_ENV') === 'development',
    };
  }
}

