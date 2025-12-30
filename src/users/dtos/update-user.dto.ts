import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @MaxLength(250)
  @IsOptional()
  email?: string;
  @MinLength(8)
  @IsOptional()
  password?: string;
  @MaxLength(150)
  @IsOptional()
  @IsString()
  @Length(2, 150)
  username?: string;
}
