import { IsNotEmpty, IsString } from 'class-validator';

export class GetCommentsDto {
  @IsNotEmpty()
  @IsString()
  postId: string;
}
