import { IsString, IsNotEmpty, IsDateString, IsEmail } from 'class-validator';

export class EmailScheduleDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}
