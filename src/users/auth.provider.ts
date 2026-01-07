import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { MoreThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { JWTPayloadType } from '../utlis/types';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { createHash, randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}
  /**
   * creating new user
   * @param registerDto data for creating a new user
   * @returns jwt (access token)
   */
  public async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto;
    const userFromDb = await this.userRepository.findOne({
      where: { email },
    });
    if (userFromDb) throw new BadRequestException('User already exist');
    let newUser = this.userRepository.create({
      email,
      password: await this.hashPassword(password),
      username,
      verificationToken: randomBytes(32).toString('hex'),
    });
    newUser = await this.userRepository.save(newUser);
    const link = this.generateLink(newUser.id, newUser.verificationToken);
    await this.mailService.sendVerifyEmailTemplate(email, link);
    return { message: 'Verification token has been sent to your email' };
  }
  /**
   * Log in User
   * @param loginDto data for log in to user account
   * @returns JWT token
   */
  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    //check if user with this email exist
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new BadRequestException('Invalid password');
    if (!user.isVerified) {
      let verificationToken = user.verificationToken;
      if (!verificationToken) {
        verificationToken = randomBytes(32).toString('hex');
        user.verificationToken = createHash('sha256')
          .update(verificationToken)
          .digest('hex');
        await this.userRepository.save(user);
      }
      const link = this.generateLink(user.id, verificationToken);
      await this.mailService.sendVerifyEmailTemplate(user.email, link);
      return { message: 'Verification token has been sent to your email' };
    }
    //todo-> Generate JWT Token
    const accessToken = await this.generateJWT({
      id: user.id,
      userType: user.userType,
    });
    await this.mailService.sendLoginEmail(user.email);
    return { accessToken };
  }
  /**
   * sending reset password link to the client
   * @param email email of user
   */
  public async sendingResetPasswordLink(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }
    // ALWAYS generate a new token
    const resetToken = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await this.userRepository.save(user);
    // SEND RAW TOKEN ONLY
    const link = `${this.config.get<string>('CLIENT_DOMAIN')}/reset-password?id=${user.id}&token=${resetToken}`;
    await this.mailService.sendResetPasswordTemplate(user.email, link);
    return { message: 'Reset password link has been sent to your email' };
  }

  /**
   * Reset the password
   */
  public async resetPassword(dto: ResetPasswordDto) {
    const { userId, resetPasswordToken, newPassword } = dto;
    const hashedToken = createHash('sha256')
      .update(resetPasswordToken)
      .digest('hex');
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }
    user.password = await this.hashPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);
    await this.mailService.sendPasswordChangedTemplate(
      user.email,
      user.username,
    );
    return { message: 'Password has been reset successfully' };
  }
  /**
   * Hashing password
   * @param password plain text password
   * @returns hashed password
   */
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  /**
   * generate json web token
   * @param payload JWT payload
   * @returns access token
   */
  private generateJWT(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /**
   * generate email verification link
   * @param id id of current user
   * @param verificationToken verification token of user
   * @returns link
   */
  private generateLink(id: number, verificationToken: string): string {
    return `${this.config.get<string>('DOMAIN')}/api/users/verify-email/${id}/${verificationToken}`;
  }
}
