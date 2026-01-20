export declare enum UserRole {
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin"
}
export declare class User {
    id: string;
    email: string;
    password: string;
    refreshToken: string | null;
    refreshTokenExpiresAt: Date | null;
    name: string;
    role: UserRole;
    isActive: boolean;
    tokenVersion: number;
    createdAt: Date;
    updatedAt: Date;
}
