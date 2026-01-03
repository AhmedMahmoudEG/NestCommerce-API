import { BadRequestException, Module } from '@nestjs/common';
import { UploadController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  controllers: [UploadController],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 100000)}`;
          const fileName = `${prefix}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('only images are allowed'), false);
        }
      },
      limits: { fileSize: 1024 * 1024 * 2 }, // 2 mega bytes
    }),
  ],
  exports: [],
})
export class UploadModule {}
