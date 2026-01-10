import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(250)
  @ApiProperty({ description: 'user email' })
  email: string;
  @IsNotEmpty()
  @MaxLength(150)
  @MinLength(8)
  @ApiProperty({ description: 'user password' })
  password: string;
}
