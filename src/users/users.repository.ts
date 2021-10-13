import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryRunner, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async getById(id: string) {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('User with this id does not exist');
    }
    return user;
  }

  async getByIds(ids: string[]) {
    const users = await this.usersRepository.find({ where: { id: In(ids) } });
    if (!users.length) {
      throw new NotFoundException();
    }
    return users;
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  getAllPrivateFiles(userId: string) {
    return this.usersRepository.findOne(userId, { relations: ['files'] });
  }

  create(userData: CreateUserDto) {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  async setJwtRefreshToken(userId: string, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: hashedToken,
    });
  }

  setTwoFactorAuthenticationSecret(secret: string, id: string) {
    return this.usersRepository.update(id, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async addAvatar(user: User, avatar: { key: string; url: string }) {
    await this.usersRepository.update(user.id, { ...user, avatar });
  }

  deleteAvatarWithQueryRunner(userId: string, queryRunner: QueryRunner) {
    return queryRunner.manager.update(User, userId, { avatar: null });
  }

  turnOnTwoFactorAuthentication(id: string) {
    return this.usersRepository.update(id, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  removeJwtRefreshToken(userId: string) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
