import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { AwsModule } from '../aws/aws.module';
import PrivateFile from './entities/private-file.entity';
import PublicFile from './entities/public-file.entity';
import { FilesRepository } from './files.repository';
import { FilesService } from './files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicFile, PrivateFile]),
    AwsModule.forFeature(S3),
    ConfigModule,
  ],
  providers: [FilesService, FilesRepository],
  exports: [FilesService],
})
export class FilesModule {}
