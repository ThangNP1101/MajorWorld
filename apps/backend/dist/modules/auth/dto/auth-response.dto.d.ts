import { User, UserRole } from '../entities/user.entity';
export declare class UserDto {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    constructor(user: User);
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserDto;
}
