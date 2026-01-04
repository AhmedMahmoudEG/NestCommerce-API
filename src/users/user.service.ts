import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dtos/login.dto';

import { AccessTokenType, JWTPayloadType } from '../utlis/types';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserType } from '../utlis/enums';
import { AuthProvider } from './auth.provider';
import { join } from 'node:path';
import { unlinkSync } from 'node:fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthProvider,
  ) {}
  /**
   * creating new user
   * @param registerDto data for creating a new user
   * @returns jwt (access token)
   */
  public async register(registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  /**
   * Log in User
   * @param loginDto data for log in to user account
   * @returns JWT token
   */
  public async login(loginDto: LoginDto): Promise<AccessTokenType> {
    return this.authService.login(loginDto);
  }
  /**
   *get current user
   * @param id id of the user
   * @returns the user from the database
   */
  public async getCurrentUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  /**
   * Get all users from Database
   * @returns collection of users
   */
  public async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  /**
   * Update User
   * @param id of logged in user
   * @param updateUserdto data for updating user
   * @returns updated user from database
   */
  public async update(id: number, updateUserdto: UpdateUserDto) {
    const { password, username, email } = updateUserdto;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    user.username = username ?? user.username;
    user.email = email ?? user.email;
    if (password) {
      user.password = await this.authService.hashPassword(password);
    }
    return this.userRepository.save(user);
  }
  /**
   * Delete User
   * @param userId id of the user
   * @param payload jwt of the user
   * @returns message about deleted user
   */
  public async deleteUser(userId: number, payload: JWTPayloadType) {
    const user = await this.getCurrentUser(userId);
    if (!user) throw new NotFoundException('user not found');
    if (userId === payload?.id || payload.userType === UserType.ADMIN)
      await this.userRepository.remove(user);
    return { message: 'User has been deleted!' };
  }
  /**
   * set profile image
   * @param userId id of logged in user
   * @param newProfileImage Profile image
   * @returns saved user
   */
  public async setProfileImage(userId: number, newProfileImage: string) {
    const user = await this.getCurrentUser(userId);
    if (user.profileImage == '') {
      user.profileImage = newProfileImage;
    } else {
      await this.deleteProfileImage(userId);
      user.profileImage = newProfileImage;
    }
    return this.userRepository.save(user);
  }
  /**
   * delete profile image
   * @param userId id of logged in user
   * @returns the  user from database
   */
  public async deleteProfileImage(userId: number) {
    const user = await this.getCurrentUser(userId);
    if (!user.profileImage) throw new BadRequestException('No profile image');
    //delete the image from file system
    const imagePath = join(
      process.cwd(),
      `./images/users/${user.profileImage}`,
    );
    unlinkSync(imagePath);
    //delete the image from db
    user.profileImage = '';
    return this.userRepository.save(user);
  }
  /**
   * Verify Email
   * @param id id of the user from link
   * @param verificationToken verification token from the link
   * @returns success message
   */
  public async verifyEmail(id: number, verificationToken: string) {
    const user = await this.getCurrentUser(id);
    if (user.verificationToken == null)
      throw new NotFoundException('there is no verification token');
    if (user.verificationToken !== verificationToken)
      throw new BadRequestException('Invalid link');
    user.isVerified = true;
    user.verificationToken = '';
    await this.userRepository.save(user);
    return { message: 'Your Email has been verified, you can now login' };
  }
}
