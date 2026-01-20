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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const crypto_1 = require("crypto");
const user_entity_1 = require("./entities/user.entity");
const auth_response_dto_1 = require("./dto/auth-response.dto");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, refreshJwtService, configService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.refreshJwtService = refreshJwtService;
        this.configService = configService;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        const tokenVersion = user.tokenVersion ?? 0;
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            tokenVersion,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = await this.generateRefreshToken({
            ...payload,
            jti: (0, crypto_1.randomUUID)(),
        });
        await this.saveRefreshToken(user.id, refreshToken, tokenVersion);
        return {
            accessToken,
            refreshToken,
            user: new auth_response_dto_1.UserDto(user),
        };
    }
    async validateUser(email, password) {
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
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async generateRefreshToken(payload) {
        return this.refreshJwtService.sign(payload);
    }
    async saveRefreshToken(userId, refreshToken, tokenVersion) {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        const expiresAt = this.getRefreshTokenExpiryDate();
        await this.userRepository.update(userId, {
            refreshToken: hashedToken,
            refreshTokenExpiresAt: expiresAt,
            ...(tokenVersion !== undefined ? { tokenVersion } : {}),
        });
    }
    async refreshAccessToken(refreshToken) {
        let payload;
        try {
            payload = this.refreshJwtService.verify(refreshToken);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.userRepository.findOne({
            where: { id: payload.sub, isActive: true },
        });
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const tokenVersion = payload.tokenVersion ?? 0;
        const userTokenVersion = user.tokenVersion ?? 0;
        if (tokenVersion !== userTokenVersion) {
            throw new common_1.UnauthorizedException('Refresh token revoked');
        }
        if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token expired');
        }
        const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isTokenValid) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const nextTokenVersion = userTokenVersion + 1;
        const nextPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            tokenVersion: nextTokenVersion,
        };
        const newAccessToken = this.jwtService.sign(nextPayload);
        const newRefreshToken = await this.generateRefreshToken({
            ...nextPayload,
            jti: (0, crypto_1.randomUUID)(),
        });
        await this.saveRefreshToken(user.id, newRefreshToken, nextTokenVersion);
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: new auth_response_dto_1.UserDto(user),
        };
    }
    async logout(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const nextTokenVersion = (user?.tokenVersion ?? 0) + 1;
        await this.userRepository.update(userId, {
            refreshToken: null,
            refreshTokenExpiresAt: null,
            tokenVersion: nextTokenVersion,
        });
    }
    async createAdmin(dto) {
        const exists = await this.userRepository.findOne({ where: { email: dto.email } });
        if (exists) {
            throw new common_1.ConflictException('Email already in use');
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
        return new auth_response_dto_1.UserDto(saved);
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return new auth_response_dto_1.UserDto(user);
    }
    getRefreshTokenExpiryDate() {
        const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '30d');
        const milliseconds = this.parseDurationToMs(expiresIn);
        return new Date(Date.now() + milliseconds);
    }
    parseDurationToMs(value) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, common_1.Inject)('JWT_REFRESH')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map