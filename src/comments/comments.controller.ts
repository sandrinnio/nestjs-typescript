import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCommentCommand } from './commands/implementations/create-comment.command';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { CurrentUser } from '../authentication/current-user.decorator';
import User from '../users/entities/user.entity';
import { GetCommentsDto } from './dto/get-comments.dto';
import { GetCommentsQuery } from './queries/implementations/get-comments.query';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getComments(@Query() { postId }: GetCommentsDto) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  createComment(@Body() comment: CreateCommentDto, @CurrentUser() user: User) {
    return this.commandBus.execute(new CreateCommentCommand(comment, user));
  }
}
