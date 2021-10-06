import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
class Message {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User)
  author: User;
}

export default Message;
