import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Service responsible for sending phishing simulation emails
 * Uses nodemailer with Gmail SMTP configuration
 */
@Injectable()
export class PhishingEmailService implements OnModuleInit {
  private readonly logger = new Logger(PhishingEmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromMail: string;
  private readonly phishingLinkBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.fromMail =
      this.configService.get<string>('SOURCE_EMAIL') ?? 'default@gmail.com';
    this.phishingLinkBaseUrl =
      this.configService.get<string>('PHISHING_LINK_BASE_URL') ??
      'http://localhost:3001/tracking/';
  }

  /**
   * Initialize email transporter on module initialization
   * Sets up SMTP connection with Gmail
   */
  onModuleInit(): void {
    const sourceEmail = this.configService.get<string>('SOURCE_EMAIL');
    const gmailAppPass = this.configService.get<string>('GMAIL_APP_PASS');

    if (!sourceEmail || !gmailAppPass) {
      this.logger.warn(
        'Email configuration incomplete. SOURCE_EMAIL and GMAIL_APP_PASS must be set.',
      );
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: sourceEmail,
          pass: gmailAppPass,
        },
      });
      this.logger.log('Email transporter initialized successfully');
    } catch (error) {
      this.logger.error(
        'Failed to initialize email transporter',
        error instanceof Error ? error.stack : '',
      );
    }
  }

  /**
   * Send phishing simulation email to target
   * @param to - Recipient email address
   * @param name - Recipient name (defaults to 'Client' if not provided)
   * @param token - One-time use token for tracking
   * @returns Promise that resolves when email is sent
   * @throws BadRequestException if SMTP credentials are invalid
   * @throws ServiceUnavailableException if email cannot be sent
   */
  async send(to: string, name: string, token: string): Promise<boolean> {
    if (!this.transporter) {
      const errorMessage = 'Email transporter is not configured';
      this.logger.error(errorMessage);
      throw new ServiceUnavailableException(errorMessage);
    }

    const phishingLink = `${this.phishingLinkBaseUrl}${token}`;
    const recipientName = name || 'Client';

    this.logger.debug(`Preparing to send email to: ${to}`);

    try {
      const response = await this.transporter.sendMail({
        from: `"LinkedIn" <${this.fromMail}>`,
        to,
        subject: `Hi ${recipientName}`,
        html: this.generateEmailTemplate(recipientName, phishingLink),
      });

      if (!response.accepted || response.accepted.length === 0) {
        this.logger.error(`Email not accepted by SMTP server for: ${to}`);
        throw new ServiceUnavailableException(
          'Email was not accepted by SMTP server.',
        );
      }

      this.logger.log(
        `Email sent successfully to: ${to}, messageId: ${response.messageId}`,
      );
      return true;
    } catch (error: any) {
      if (error.message?.includes('Invalid login') || error.code === 'EAUTH') {
        this.logger.error('Invalid SMTP credentials');
        throw new BadRequestException(
          'Invalid SMTP credentials. Please verify your email configuration.',
        );
      }

      this.logger.error(
        `Failed to send email to ${to}: ${error.message}`,
        error.stack,
      );
      throw new ServiceUnavailableException(
        `Failed to send email: ${error.message}`,
      );
    }
  }

  /**
   * Generate HTML email template for phishing simulation
   * @private
   */
  private generateEmailTemplate(name: string, link: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0077b5;">Hi ${name}!</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Thanks for joining us. We're excited to have you on board!
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          Please click the link below to complete your registration:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" 
             style="display: inline-block; padding: 12px 24px; background-color: #0077b5; 
                    color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600;">
            Complete Registration
          </a>
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${link}" style="color: #0077b5; word-break: break-all;">${link}</a>
        </p>
      </div>
    `;
  }
}

