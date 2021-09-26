import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;
}
