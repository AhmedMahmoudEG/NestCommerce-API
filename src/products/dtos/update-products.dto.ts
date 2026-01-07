import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ description: 'product title' })
  title?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(5)
  @ApiPropertyOptional({ description: 'product description' })
  description?: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'price should not be less than zero' })
  @IsOptional()
  @ApiPropertyOptional({ description: 'product price' })
  price?: number;
}
