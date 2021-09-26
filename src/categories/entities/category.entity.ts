import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  public posts: Post[];
}

export default Category;
