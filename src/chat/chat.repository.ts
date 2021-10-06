import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import Message from './entities/message.entity';
import User from '../users/entities/user.entity';
import { PaginationParams } from '../utils/types/pagination-params';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  saveMessage(message: string, author: User) {
    const newMessage = this.messageRepository.create({
      content: message,
      author,
    });
    return this.messageRepository.save(newMessage);
  }

  async getMessages(pagination: PaginationParams) {
    const query = pagination?.startId
      ? { id: MoreThan(pagination.startId) }
      : {};
    const messagesCount = await this.messageRepository.count();
    const [items, count] = await this.messageRepository.findAndCount({
      where: query,
      skip: pagination?.offset,
      take: pagination?.limit,
      relations: ['author'],
      order: {
        id: 'ASC',
      },
    });
    return { items, count: pagination?.startId ? messagesCount : count };
  }
}
