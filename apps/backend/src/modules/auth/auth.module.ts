import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'majorworld-secret-key-change-in-production'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '5m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtRefreshAuthGuard,
    {
      provide: 'JWT_REFRESH',
      useFactory: (configService: ConfigService) =>
        new JwtService({
          secret: configService.get<string>(
            'JWT_REFRESH_SECRET',
            configService.get<string>('JWT_SECRET', 'majorworld-secret-key-change-in-production'),
          ),
          signOptions: {
            expiresIn: configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
          },
        }),
      inject: [ConfigService],
    },
  ],
  exports: [AuthService, JwtModule, PassportModule, JwtRefreshAuthGuard],
})
export class AuthModule {}
