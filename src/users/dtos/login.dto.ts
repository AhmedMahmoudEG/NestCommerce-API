import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(250)
  email: string;
  @IsNotEmpty()
  @MaxLength(150)
  @MinLength(8)
  password: string;
}
