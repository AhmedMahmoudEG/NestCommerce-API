import {
  IsNotEmpty,
  IsNumber,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @MaxLength(150)
  @MinLength(8)
  newPassword: string;
  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  userId: number;
  @IsNotEmpty()
  @MaxLength(250)
  resetPasswordToken: string;
}
