import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { UserType } from '../../utlis/enums';
import { CURRENT_USER_KEY } from '../../utlis/constants';
import { UserService } from '../user.service';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  constructor(
    private readonly reflactor: Reflector,
    private readonly JwtSerivce: JwtService,
    private readonly config: ConfigService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    //this will allow me to  read meta data of method
    const roles: UserType[] = await this.reflactor.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length == 0) return false;
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (token && type === 'Bearer') {
      try {
        const payload = await this.JwtSerivce.verifyAsync(token, {
          secret: this.config.get<string>('JWT_SECRET'),
        });
        const user = await this.userService.getCurrentUser(payload.id);
        if (!user) return false;
        if (roles.includes(user.userType)) {
          request[CURRENT_USER_KEY] = payload;
          return true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new UnauthorizedException('access denied, Invalid Token');
      }
    } else {
      throw new UnauthorizedException('access denied, No Token Provided');
    }
    throw new UnauthorizedException(
      'access denied, admin only, You are not allowed',
    );
  }
}
