import { IsString, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  title?: string;
}
