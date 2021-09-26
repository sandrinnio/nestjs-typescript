import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import PublicFile from './entities/public-file.entity';
import { FilesRepository } from './files.repository';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFile]), ConfigModule],
  providers: [FilesService, FilesRepository],
  exports: [FilesService],
})
export class FilesModule {}
