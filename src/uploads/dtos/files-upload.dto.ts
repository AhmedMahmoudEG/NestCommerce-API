import { ApiProperty } from '@nestjs/swagger';
import type { Express } from 'express';
export class FilesUploadDto {
  @ApiProperty({
    type: 'array',
    name: 'files',
    items: { type: 'string', format: 'binary' },
  })
  files: Express.Multer.File;
}
