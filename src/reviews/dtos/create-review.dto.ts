import { IsNumber, IsString, Max, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @ApiProperty({ description: 'rating' })
  rating: number;
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'comment' })
  comment: string;
}
