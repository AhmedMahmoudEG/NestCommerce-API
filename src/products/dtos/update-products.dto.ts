import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Length,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 14)
  @IsOptional()
  title?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(5)
  description?: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'price should not be less than zero' })
  @IsOptional()
  price?: number;
}
