import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getById(userId: number) {
    return this.usersRepository.getById(userId);
  }

  getByEmail(email: string) {
    return this.usersRepository.getByEmail(email);
  }

  createUser(userData: CreateUserDto) {
    return this.usersRepository.create(userData);
  }
}
