import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CURRENT_USER_KEY } from '../../utlis/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly JwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (token && type === 'Bearer') {
      try {
        const payload = await this.JwtService.verifyAsync(token, {
          secret: this.config.get<string>('JWT_SECRET'),
        });
        request[CURRENT_USER_KEY] = payload;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new UnauthorizedException('access denied, Invalid Token');
      }
    } else {
      throw new UnauthorizedException('access denied, No Token Provided');
    }
    return true;
  }
}
