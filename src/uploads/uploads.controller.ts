import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import type { Express, Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesUploadDto } from './dtos/files-upload.dto';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ImageUploadDto } from './dtos/file-upload.dto';
@Controller('api/uploads')
export class UploadController {
  //POST ~ api/uploads/multiple-files'
  @Post('multiple-files')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
    description: 'multiple files',
  })
  public UploadMultiplesFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException('no file Provided');
    console.log('File Uploaded!', { files });
    return { message: 'File Uploaded Successfully!' };
  }
  //POST ~ api/uploads
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ImageUploadDto,
    description: 'image',
  })
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
