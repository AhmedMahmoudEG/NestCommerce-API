import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class UpdateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  @ApiPropertyOptional({ description: 'rating' })
  rating?: number;
  @IsString()
  @IsOptional()
  @MinLength(2)
  @ApiPropertyOptional({ description: 'comment' })
  comment?: string;
}
