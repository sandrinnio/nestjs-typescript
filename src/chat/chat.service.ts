import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthenticationService } from '../authentication/authentication.service';
import User from '../users/entities/user.entity';
import { PaginationParams } from '../utils/types/pagination-params';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly chatRepository: ChatRepository,
  ) {}

  saveMessage(message: string, author: User) {
    return this.chatRepository.saveMessage(message, author);
  }

  getMessages(pagination: PaginationParams) {
    return this.chatRepository.getMessages(pagination);
  }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authenticationService.getUserFromCookie(
      authenticationToken,
    );
    if (!user) {
      throw new WsException('Invalid Credentials');
    }
    return user;
  }
}
