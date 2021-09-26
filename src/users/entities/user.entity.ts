import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Address from './address.entity';
import { Post } from '../../posts/entities/post.entity';
import PublicFile from '../../files/entities/public-file.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];

  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'avatar_id', referencedColumnName: 'id' })
  public avatar?: PublicFile;
}

export default User;
