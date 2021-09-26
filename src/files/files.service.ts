import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { InjectAwsService } from '../aws/decorators/aws-service.decorator';
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
}