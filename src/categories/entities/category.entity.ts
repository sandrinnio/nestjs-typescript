import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import Post from '../../posts/entities/post.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  posts: Post[];
}

export default Category;
