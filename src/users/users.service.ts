import { Injectable } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService,
  ) {}

  getById(userId: string) {
    return this.usersRepository.getById(userId);
  }

  getByEmail(email: string) {
    return this.usersRepository.getByEmail(email);
  }

  createUser(userData: CreateUserDto) {
    return this.usersRepository.create(userData);
  }

  async addAvatar(user: User, imageBuffer: Buffer, fileName: string) {
    await this.deleteAvatar(user);
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      fileName,
    );
    await this.usersRepository.addAvatar(user, avatar);
    return avatar;
  }

  async deleteAvatar(user: User) {
    if (user.avatar?.id) {
      await this.usersRepository.addAvatar(user, null);
      await this.filesService.deletePublicFile(user.avatar.id);
    }
  }
}
