import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { CreateAdminDto } from './dto/create-admin.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    private refreshJwtService;
    private configService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, refreshJwtService: JwtService, configService: ConfigService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    validateUser(email: string, password: string): Promise<User | null>;
    hashPassword(password: string): Promise<string>;
    generateRefreshToken(payload: JwtPayload): Promise<string>;
    saveRefreshToken(userId: string, refreshToken: string, tokenVersion?: number): Promise<void>;
    refreshAccessToken(refreshToken: string): Promise<AuthResponseDto>;
    logout(userId: string): Promise<void>;
    createAdmin(dto: CreateAdminDto): Promise<UserDto>;
    getProfile(userId: string): Promise<UserDto>;
    private getRefreshTokenExpiryDate;
    private parseDurationToMs;
}
