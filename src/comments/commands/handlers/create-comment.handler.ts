import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentCommand } from '../implementations/create-comment.command';
import Comment from '../../entities/comment.entity';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  execute(command: CreateCommentCommand) {
    const newPostWithComment = this.commentRepository.create({
      ...command.comment,
      author: command.author,
    });
    return this.commentRepository.save(newPostWithComment);
  }

  private addReply(command: CreateCommentCommand) {
    const reply = this.commentRepository.create({
      ...command.comment,
      author: command.author,
    });
    return this.commentRepository.save(reply);
  }
}
