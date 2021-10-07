import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Connection } from 'typeorm';
import { FilesService } from '../files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService,
    private readonly connection: Connection,
  ) {}

  getById(userId: string) {
    return this.usersRepository.getById(userId);
  }

  getByIds(ids: string[]) {
    return this.usersRepository.getByIds(ids);
  }

  getByEmail(email: string) {
    return this.usersRepository.getByEmail(email);
  }

  async getUserFromRefreshToken(userId: string, token: string) {
    const user = await this.getById(userId);
    const isRefreshTokenMatches = await bcrypt.compare(
      token,
      user.currentHashedRefreshToken,
    );
    if (!isRefreshTokenMatches) {
      throw new UnauthorizedException(userId);
    }
    return user;
  }

  async getPrivateFile(fileId: string, ownerId: string) {
    const file = await this.filesService.getPrivateFile(fileId);
    if (file.info.owner.id !== ownerId) {
      throw new UnauthorizedException();
    }
    return file;
  }

  async getAllPrivateFilesPresignedURLs(userId: string) {
    const userWithFiles = await this.usersRepository.getAllPrivateFiles(userId);
    if (!userWithFiles.files) {
      throw new NotFoundException('User does not exist');
    }
    const generatedPresignedUrls = userWithFiles.files.map((file) =>
      this.filesService.generatePresignedUrl(file.key),
    );
    return Promise.all(generatedPresignedUrls);
  }

  createUser(userData: CreateUserDto) {
    return this.usersRepository.create(userData);
  }

  setJwtRefreshToken(userId: string, token: string) {
    return this.usersRepository.setJwtRefreshToken(userId, token);
  }

  addPrivateFile(user: User, fileBuffer: Buffer, filename: string) {
    return this.filesService.uploadPrivateFile(fileBuffer, user, filename);
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
    const queryRunner = this.connection.createQueryRunner();
    const fileId = user.avatar?.id;
    if (!fileId) {
      throw new NotFoundException(fileId);
    }
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.usersRepository.deleteAvatarWithQueryRunner(
        user.id,
        queryRunner,
      );
      await this.filesService.deletePublicFileWithQueryRunner(
        user.avatar.id,
        queryRunner,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        message: `Transaction Failed ${error}`,
      });
    } finally {
      await queryRunner.release();
    }
  }

  removeJwtRefreshToken(userId: string) {
    return this.usersRepository.removeJwtRefreshToken(userId);
  }
}
