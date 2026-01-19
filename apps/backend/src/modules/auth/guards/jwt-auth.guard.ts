import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const route = `${request.method} ${request.url}`;
    
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.log(`Checking auth for ${route} | isPublic: ${isPublic} | hasAuthHeader: ${!!request.headers.authorization}`);

    if (isPublic) {
      this.logger.log(`Route ${route} is public, skipping auth`);
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const route = `${request.method} ${request.url}`;
    
    if (err || !user) {
      this.logger.error(`Auth failed for ${route} | error: ${err?.message || 'no user'} | info: ${info?.message || 'none'}`);
    } else {
      this.logger.log(`Auth succeeded for ${route} | user: ${user.email}`);
    }
    
    return super.handleRequest(err, user, info, context);
  }
}
