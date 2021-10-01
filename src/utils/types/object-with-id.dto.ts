import { IsNotEmpty, IsString } from 'class-validator';

export class ObjectWithId {
  @IsNotEmpty()
  @IsString()
  id: string;
}
