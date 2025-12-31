import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('api/uploads')
export class UploadController {
  //POST ~ api/uploads
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
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
  )
  public UploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('no file Provided');
    console.log('File Uploaded!', { file });
    return { message: 'File Uploaded Successfully!' };
  }
  //GET ~ api/uploads/image
  @Get(':image')
  public showUploadedImage(
    @Param('image') image: string,
    @Res() res: Response,
  ) {
    return res.sendFile(image, { root: './images' });
  }
}
