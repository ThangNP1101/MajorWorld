import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserDto } from './dto/auth-response.dto';
import { User } from './entities/user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refresh(dto: RefreshTokenDto): Promise<AuthResponseDto>;
    getProfile(user: User): Promise<UserDto>;
    logout(user: User): Promise<{
        message: string;
    }>;
    createAdmin(user: User, dto: CreateAdminDto): Promise<UserDto>;
}
