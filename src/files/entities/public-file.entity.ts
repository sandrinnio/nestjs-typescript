import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class PublicFile {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  url: string;

  @Column()
  key: string;
}

export default PublicFile;
