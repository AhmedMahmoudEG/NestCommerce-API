import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Length,
  MinLength,
} from 'class-validator';

export class CreateProductsDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 14)
  title: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  description: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;
}
