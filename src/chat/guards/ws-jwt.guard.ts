import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthenticationService } from '../../authentication/authentication.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly authService: AuthenticationService) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();
    const { Authentication } = parse(client.handshake.headers.cookie);
    const user = await this.authService.getUserFromCookie(Authentication);
    if (!user) {
      throw new WsException('Invalid Credentials');
    }
    context.switchToHttp().getRequest().user = user;
    return !!user;
  }
}
