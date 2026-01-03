import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { AccessTokenType, JWTPayloadType } from '../utlis/types';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  /**
   * creating new user
   * @param registerDto data for creating a new user
   * @returns jwt (access token)
   */
  public async register(registerDto: RegisterDto): Promise<AccessTokenType> {
    const { email, password, username } = registerDto;

    const userFromDb = await this.userRepository.findOne({
      where: { email },
    });
    if (userFromDb) throw new BadRequestException('User already exist');
    let newUser = this.userRepository.create({
      email,
      password: await this.hashPassword(password),
      username,
    });
    newUser = await this.userRepository.save(newUser);
    //ToDo --> Generate JWT Token
    const payload: JWTPayloadType = {
      id: newUser.id,
      userType: newUser.userType,
    };
    const accessToken = await this.generateJWT(payload);
    return { accessToken };
  }
  /**
   * Log in User
   * @param loginDto data for log in to user account
   * @returns JWT token
   */
  public async login(loginDto: LoginDto): Promise<AccessTokenType> {
    const { email, password } = loginDto;
    //check if user with this email exist
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new BadRequestException('Invalid password');
    //todo-> Generate JWT Token

    const accessToken = await this.generateJWT({
      id: user.id,
      userType: user.userType,
    });
    await this.mailService.sendLoginEmail(user.email);
    return { accessToken };
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
}
