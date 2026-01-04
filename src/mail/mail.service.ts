import { Injectable, RequestTimeoutException } from '@nestjs/common';
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
}
