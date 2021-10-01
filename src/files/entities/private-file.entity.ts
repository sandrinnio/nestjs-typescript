import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
class PrivateFile {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  url: string;

  @Column()
  key: string;

  @ManyToOne(() => User, (user: User) => user.files)
  owner: User;
}

export default PrivateFile;
