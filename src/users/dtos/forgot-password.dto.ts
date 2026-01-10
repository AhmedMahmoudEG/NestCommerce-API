import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(250)
  @ApiProperty({ description: 'user email' })
  email: string;
}
