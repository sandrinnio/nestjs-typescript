import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity()
class Address {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @OneToOne(() => User, (user: User) => user.address)
  user: User;
}

export default Address;
