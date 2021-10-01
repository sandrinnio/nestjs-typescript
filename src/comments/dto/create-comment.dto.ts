import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ObjectWithId } from '../../utils/types/object-with-id.dto';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @ValidateNested()
  @Type(() => ObjectWithId)
  post: ObjectWithId;
}
