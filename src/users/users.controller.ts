import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { CurrentUser } from '../authentication/current-user.decorator';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import User from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('file/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getPrivateFile(
    @Param('id') fileId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ) {
    const file = await this.usersService.getPrivateFile(fileId, user.id);
    file.stream.pipe(res);
  }

  @Get('files')
  @UseGuards(JwtAuthenticationGuard)
  getAllPrivateFilesPresignedURLs(@CurrentUser() user: User) {
    return this.usersService.getAllPrivateFilesPresignedURLs(user.id);
  }

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  addAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addAvatar(user, file.buffer, file.originalname);
  }

  @Post('file')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  addPrivateFile(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addPrivateFile(
      user,
      file.buffer,
      file.originalname,
    );
  }
}
