import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @IsEmail()
  @MaxLength(250)
  @IsNotEmpty()
  @ApiProperty({ description: 'user email' })
  email: string;
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({ description: 'user password' })
  password: string;
  @MaxLength(150)
  @IsOptional()
  @IsString()
  @Length(2, 150)
  @ApiProperty({ description: 'user username' })
  username: string;
}
