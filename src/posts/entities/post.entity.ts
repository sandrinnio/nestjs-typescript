import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import Category from '../../categories/entities/category.entity';
import Comment from '../../comments/entities/comment.entity';
import User from '../../users/entities/user.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'text', array: true, nullable: true })
  keywords?: string[];

  @ManyToOne(() => User, (author: User) => author.posts, { eager: true })
  author: User;

  @RelationId((post: Post) => post.author)
  authorId: string;

  @ManyToMany(() => Category, (category: Category) => category.posts, {
    eager: true,
    cascade: true,
  })
  @JoinTable({ name: 'posts_categories' })
  categories: Category[];

  @OneToMany(() => Comment, (comment: Comment) => comment.post, { eager: true })
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

export default Post;
