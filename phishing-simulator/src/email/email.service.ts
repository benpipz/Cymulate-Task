import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class PhishingEmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private readonly fromMail: string;
  private readonly phishingLinkBaseUrl: string;

  constructor(private readonly configModule: ConfigService) {
    this.fromMail =
      this.configModule.get<string>('SOURCE_EMAIL') ?? 'default@gmail.com';
    this.phishingLinkBaseUrl =
      this.configModule.get<string>('PHISHING_LINK_BASE_URL') ??
      'http://localhost:3000/tracking/';
  }

  onModuleInit() {
    try {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: this.configModule.get<string>('SOURCE_EMAIL'),
          pass: this.configModule.get<string>('GMAIL_APP_PASS'),
        },
      });
    } catch (err) {
      console.error('Error setting up email transporter:', err);
    }
  }

  async send(to: string, name: string, targetHashcode: string) {
    if (!this.transporter) {
      console.error('Email transporter is not configured.');
      return;
    }
    const phishingLink = `${this.phishingLinkBaseUrl}${targetHashcode}`;
    try {
      const response = await this.transporter.sendMail({
        from: `"LinkedIn" <${this.fromMail}>`,
        to,
        subject: `Hi ${name}`,
        html: `<h1>Hi ${name}!</h1>
            <p>Thanks for joining us</p>
            <a href="${phishingLink}">${phishingLink}</a>`,
      });
      if (!response.accepted || response.accepted.length === 0) {
        throw new ServiceUnavailableException(
          'Email was not accepted by SMTP server.',
        );
      }
      return true;
    } catch (error) {
      if (error.message.includes('Invalid login')) {
        throw new BadRequestException(
          'Invalid SMTP credentials. Please verify your email configuration.',
        );
      }

      throw new ServiceUnavailableException(
        `Failed to send email: ${error.message}`,
      );
    }
  }
}
