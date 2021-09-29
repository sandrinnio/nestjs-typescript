import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import Category from '../../categories/entities/category.entity';
import User from '../../users/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({ type: 'text', array: true, nullable: true })
  public keywords?: string[];

  @ManyToOne(() => User, (author: User) => author.posts, { eager: true })
  public author: User;

  @RelationId((post: Post) => post.author)
  public authorId?: string;

  @ManyToMany(() => Category, (category: Category) => category.posts, {
    eager: true,
    cascade: true,
  })
  @JoinTable({ name: 'posts_categories' })
  public categories?: Category[];
}
