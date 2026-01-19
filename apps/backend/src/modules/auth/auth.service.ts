import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject('JWT_REFRESH')
    private refreshJwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const tokenVersion = user.tokenVersion ?? 0;
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken({
      ...payload,
      jti: randomUUID(),
    });
    await this.saveRefreshToken(user.id, refreshToken, tokenVersion);

    return {
      accessToken,
      refreshToken,
      user: new UserDto(user),
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return this.refreshJwtService.sign(payload);
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    tokenVersion?: number,
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = this.getRefreshTokenExpiryDate();

    await this.userRepository.update(userId, {
      refreshToken: hashedToken,
      refreshTokenExpiresAt: expiresAt,
      ...(tokenVersion !== undefined ? { tokenVersion } : {}),
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthResponseDto> {
    let payload: JwtPayload;
    try {
      payload = this.refreshJwtService.verify(refreshToken) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenVersion = payload.tokenVersion ?? 0;
    const userTokenVersion = user.tokenVersion ?? 0;
    if (tokenVersion !== userTokenVersion) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const nextTokenVersion = userTokenVersion + 1;
    const nextPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: nextTokenVersion,
    };
    const newAccessToken = this.jwtService.sign(nextPayload);
    const newRefreshToken = await this.generateRefreshToken({
      ...nextPayload,
      jti: randomUUID(),
    });

    await this.saveRefreshToken(user.id, newRefreshToken, nextTokenVersion);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: new UserDto(user),
    };
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const nextTokenVersion = (user?.tokenVersion ?? 0) + 1;
    await this.userRepository.update(userId, {
      refreshToken: null,
      refreshTokenExpiresAt: null,
      tokenVersion: nextTokenVersion,
    });
  }

  async createAdmin(dto: CreateAdminDto): Promise<UserDto> {
    const exists = await this.userRepository.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashPassword(dto.password);
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: dto.role ?? undefined,
      isActive: true,
    });

    const saved = await this.userRepository.save(user);
    return new UserDto(saved);
  }

  async getProfile(userId: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return new UserDto(user);
  }

  private getRefreshTokenExpiryDate(): Date {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d');
    const milliseconds = this.parseDurationToMs(expiresIn);
    return new Date(Date.now() + milliseconds);
  }

  private parseDurationToMs(value: string): number {
    const match = /^(\d+)([smhd])$/.exec(value);
    if (match) {
      const amount = Number(match[1]);
      const unit = match[2];
      switch (unit) {
        case 's':
          return amount * 1000;
        case 'm':
          return amount * 60 * 1000;
        case 'h':
          return amount * 60 * 60 * 1000;
        case 'd':
          return amount * 24 * 60 * 60 * 1000;
        default:
          break;
      }
    }

    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return numeric * 1000;
    }

    return 30 * 24 * 60 * 60 * 1000;
  }
}
