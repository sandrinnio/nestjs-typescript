import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { QueryRunner } from 'typeorm';
import { InjectAwsService } from '../aws/decorators/aws-service.decorator';
import User from '../users/entities/user.entity';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
  constructor(
    @InjectAwsService(S3) private readonly s3: S3,
    private filesRepository: FilesRepository,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${Date.now()}-${filename}`,
      })
      .promise();
    return this.filesRepository.createPublicFile(
      uploadResult.Location,
      uploadResult.Key,
    );
  }

  async deletePublicFile(fileId: string) {
    const file = await this.filesRepository.getPublicFile(fileId);
    if (!file) {
      throw new NotFoundException(fileId);
    }
    await this.s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await this.filesRepository.deletePublicFile(fileId);
  }

  async deletePublicFileWithQueryRunner(
    fileId: string,
    queryRunner: QueryRunner,
  ) {
    const file = await this.filesRepository.getPublicFile(fileId);
    if (!file) {
      throw new NotFoundException(fileId);
    }
    await this.s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await this.filesRepository.deletePublicFileWithQueryRunner(
      fileId,
      queryRunner,
    );
  }

  async getPrivateFile(fileId: string) {
    const privateFile = await this.filesRepository.getPrivateFile(fileId);
    if (!privateFile) {
      throw new NotFoundException(fileId);
    }
    const stream = this.s3
      .getObject({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Key: privateFile.key,
      })
      .createReadStream();
    return {
      stream,
      info: privateFile,
    };
  }

  async uploadPrivateFile(dataBuffer: Buffer, owner: User, filename: string) {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${Date.now()}-${filename}`,
      })
      .promise();
    const newPrivateFile = await this.filesRepository.createPrivateFile(
      uploadResult.Location,
      uploadResult.Key,
      owner,
    );
    return newPrivateFile;
  }

  generatePresignedUrl(key: string) {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
    });
  }
}
