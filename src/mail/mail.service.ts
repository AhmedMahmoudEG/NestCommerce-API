import {
  ForbiddenException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * sending email after user logged in his account
   * @param user logged in user
   */
  public async sendLoginEmail(email: string) {
    try {
      const today = new Date();
      await this.mailerService.sendMail({
        to: email,
        from: '<no-reply>@my-nestjs-app.com',
        subject: 'logged in',
        template: 'login',
        context: {
          email,
          today,
        },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException('email not sent');
    }
  }

  /**
   * sending verify email template
   * @param email email of regisiterd  user
   * @param link link with id of user and verification token
   */
  public async sendVerifyEmailTemplate(email: string, link: string) {
    try {
      const appName = 'my-nestjs-app';
      await this.mailerService.sendMail({
        to: email,
        from: '<no-reply>@my-nestjs-app.com',
        subject: 'Verify Your Account',
        template: 'verify-email',
        context: { link, appName },
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('email not sent');
    }
  }

  /**
   * reset password template email
   * @param email email of user
   * @param resetPasswordlink link of reset password
   */
  public async sendResetPasswordTemplate(
    email: string,
    resetPasswordLink: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: '<no-reply>@my-nestjs-app.com',
        subject: 'Reset Your Password',
        template: 'reset-password',
        context: { resetPasswordLink },
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('email not sent');
    }
  }
  /**
   * verify password changed email
   * @param email email of user
   * @param username username of user
   */
  public async sendPasswordChangedTemplate(email: string, username: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: '<no-reply>@my-nestjs-app.com',
        subject: 'Your Password has been changed',
        template: 'password-changed',
        context: { username },
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('email not sent');
    }
  }
}
