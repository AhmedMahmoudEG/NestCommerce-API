import { ApiProperty } from '@nestjs/swagger';
import type { Express } from 'express';

export class ImageUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', name: 'file' })
  'file': Express.Multer.File;
}
