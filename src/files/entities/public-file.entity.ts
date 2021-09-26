import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class PublicFile {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public url: string;

  @Column()
  public key: string;
}

export default PublicFile;
