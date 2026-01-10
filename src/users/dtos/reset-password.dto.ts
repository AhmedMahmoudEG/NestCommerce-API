import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class ResetPasswordDto {
  @IsNotEmpty()
  @MaxLength(150)
  @MinLength(8)
  @ApiProperty({ description: 'new password' })
  newPassword: string;
  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'user id' })
  userId: number;
  @IsNotEmpty()
  @MaxLength(250)
  @ApiProperty({ description: 'reset password token' })
  resetPasswordToken: string;
}
