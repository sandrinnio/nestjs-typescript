import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Post from '../../posts/entities/post.entity';
import User from '../../users/entities/user.entity';

@Entity()
class Comment {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  content: string;

  @ManyToOne(() => Post, (post: Post) => post.comments)
  post: Post;

  @ManyToOne(() => User, (user: User) => user.posts)
  author: User;
}

export default Comment;
