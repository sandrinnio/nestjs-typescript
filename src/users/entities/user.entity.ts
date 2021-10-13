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
import Post from '../../posts/entities/post.entity';
import PublicFile from '../../files/entities/public-file.entity';
import PrivateFile from '../../files/entities/private-file.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  @Exclude()
  twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  posts: Post[];

  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'avatar_id', referencedColumnName: 'id' })
  avatar?: PublicFile;

  @OneToMany(() => PrivateFile, (files: PrivateFile) => files.owner)
  files: PrivateFile[];
}

export default User;
