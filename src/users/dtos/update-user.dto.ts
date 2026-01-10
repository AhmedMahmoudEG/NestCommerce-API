import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateUserDto {
  @IsEmail()
  @MaxLength(250)
  @IsOptional()
  @ApiPropertyOptional({ description: 'user email' })
  email?: string;
  @MinLength(8)
  @IsOptional()
  @ApiPropertyOptional({ description: 'user password' })
  password?: string;
  @MaxLength(150)
  @IsOptional()
  @IsString()
  @Length(2, 150)
  @ApiPropertyOptional({ description: 'user username' })
  username?: string;
}
