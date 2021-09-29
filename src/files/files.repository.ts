import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import User from '../users/entities/user.entity';
import PrivateFile from './entities/private-file.entity';
import PublicFile from './entities/public-file.entity';

@Injectable()
export class FilesRepository {
  constructor(
    @InjectRepository(PublicFile)
    private readonly publicFilesRepository: Repository<PublicFile>,
    @InjectRepository(PrivateFile)
    private readonly privateFilesRepository: Repository<PrivateFile>,
  ) {}

  getPublicFile(fileId: string) {
    return this.publicFilesRepository.findOne(fileId);
  }

  getPrivateFile(fileId: string) {
    return this.privateFilesRepository.findOne(fileId, {
      relations: ['owner'],
    });
  }

  createPublicFile(url: string, key: string) {
    const newFile = this.publicFilesRepository.create({
      url,
      key,
    });
    return this.publicFilesRepository.save(newFile);
  }

  async deletePublicFile(fileId: string) {
    const deleteResponse = await this.publicFilesRepository.delete(fileId);
    if (!deleteResponse.affected) {
      throw new NotFoundException(fileId);
    }
  }

  async deletePublicFileWithQueryRunner(
    fileId: string,
    queryRunner: QueryRunner,
  ) {
    const deleteResponse = await queryRunner.manager.delete(PublicFile, fileId);
    if (!deleteResponse.affected) {
      throw new NotFoundException(fileId);
    }
  }

  createPrivateFile(url: string, key: string, owner: User) {
    const newPrivateFile = this.privateFilesRepository.create({
      url,
      key,
      owner,
    });
    return this.privateFilesRepository.save(newPrivateFile);
  }
}
