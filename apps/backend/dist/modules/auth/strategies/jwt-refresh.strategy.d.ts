import { Repository } from 'typeorm';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { JwtPayload } from './jwt.strategy';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private userRepository;
    private configService;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
