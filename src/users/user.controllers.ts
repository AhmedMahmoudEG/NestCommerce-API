import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import * as types from '../utlis/types';
import { Roles } from './decorators/user-role.decorator';
import { UserType } from '../utlis/enums';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthRolesGuard } from './guards/auth-roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import type { Express, Response } from 'express';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ApiSecurity, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ImageUploadDto } from './dtos/image-upload.dto';
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //POST :/api/users/auth/register
  @Post('auth/register')
  public register(@Body() body: RegisterDto) {
    return this.userService.register(body);
  }
  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  public Login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }
  //GET : api/users/current-user
  @Get('current-user')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  public getCurrentUser(@CurrentUser() payload: types.JWTPayloadType) {
    return this.userService.getCurrentUser(payload.id);
  }

  //GET :api/users

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  public getAllUser() {
    return this.userService.getAll();
  }

  //PUT: api/users
  @Put()
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  public updateUser(
    @CurrentUser() payload: types.JWTPayloadType,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(payload.id, body);
  }

  //DELETE : api/users
  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  @UseGuards(AuthRolesGuard)
  @ApiSecurity('bearer')
  public deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    return this.userService.deleteUser(id, payload);
  }

  //POST :api/users/upload-image
  @Post('upload-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('user-image'))
  @ApiSecurity('bearer')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ImageUploadDto,
    description: 'profile image',
  })
  public uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() payload: types.JWTPayloadType,
  ) {
    if (!file) throw new BadRequestException('No file Provided');
    return this.userService.setProfileImage(payload.id, file.filename);
  }
  //DELETE ~api/users/remove-image
  @Delete('images/remove-image')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  public removeProfileImage(@CurrentUser() payload: types.JWTPayloadType) {
    return this.userService.deleteProfileImage(payload.id);
  }

  //GET ~api/users/images/:image
  @Get('images/:image')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  public getProfileImage(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: './images/users' });
  }

  //GET ~api/users/verify-email/:id/:verificationToken
  @Get('verify-email/:id/:verificationToken')
  public verifyEmail(
    @Param('id', ParseIntPipe) id: number,
    @Param('verificationToken') verificationToken: string,
  ) {
    return this.userService.verifyEmail(id, verificationToken);
  }

  //POST ~api/users/forgot-password/
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  public forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.userService.sendResetPassword(body.email);
  }
  //POST ~api/users/reset-password/
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  public resetPassword(@Body() body: ResetPasswordDto) {
    return this.userService.resetPassword(body);
  }
}
