import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
  @IsString()
  @IsOptional()
  @MinLength(2)
  comment?: string;
}
