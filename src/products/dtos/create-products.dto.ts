import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Length,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductsDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 14)
  @ApiProperty({ description: 'product title' })
  title: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ description: 'product description' })
  description: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({ description: 'product price' })
  price: number;
}
