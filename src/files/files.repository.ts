import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PublicFile from './entities/public-file.entity';

@Injectable()
export class FilesRepository {
  constructor(
    @InjectRepository(PublicFile)
    private readonly publicFilesRepository: Repository<PublicFile>,
  ) {}

  getPublicFile(fileId: string) {
    return this.publicFilesRepository.findOne(fileId);
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
}
