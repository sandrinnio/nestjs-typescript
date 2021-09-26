import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { AwsModule } from '../aws/aws.module';
import PublicFile from './entities/public-file.entity';
import { FilesRepository } from './files.repository';
import { FilesService } from './files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicFile]),
    AwsModule.forFeature(S3),
    ConfigModule,
  ],
  providers: [FilesService, FilesRepository],
  exports: [FilesService],
})
export class FilesModule {}
