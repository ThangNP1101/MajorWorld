import { Repository } from 'typeorm';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    tokenVersion?: number;
    jti?: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepository;
    private configService;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
