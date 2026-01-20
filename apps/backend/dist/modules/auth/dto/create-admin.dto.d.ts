import { UserRole } from '../entities/user.entity';
export declare class CreateAdminDto {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
}
