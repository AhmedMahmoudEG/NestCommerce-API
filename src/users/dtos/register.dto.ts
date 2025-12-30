import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(250)
  @IsNotEmpty()
  email: string;
  @MinLength(8)
  @IsNotEmpty()
  password: string;
  @MaxLength(150)
  @IsOptional()
  @IsString()
  @Length(2, 150)
  username: string;
}
