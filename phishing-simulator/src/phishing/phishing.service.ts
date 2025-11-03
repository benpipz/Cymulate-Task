import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePhishingDto } from './dto/create-phishing.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetDocument,
} from './entities/phishing.entity';
import { Model } from 'mongoose';
import {
  generateEmailDateHashBase64,
  generatePhishingToken,
} from '../common/utils/hashing.util';
import { PhishingEmailService } from 'src/phishing-email/phishing-email.service';
import { TOKEN_EXPIRY_DAYS, INITIAL_RESET_VERSION } from '../common/constants';

@Injectable()
export class PhishingService {
  private readonly logger = new Logger(PhishingService.name);

  constructor(
    @InjectModel(PhishingTarget.name)
    private phishingTargetModel: Model<PhishingTargetDocument>,
    private emailService: PhishingEmailService,
  ) {}

  async create(createPhishingDto: CreatePhishingDto): Promise<PhishingTargetDocument> {
    this.logger.log(
      `Creating phishing attempt for email: ${createPhishingDto.targetMail}`,
    );

    try {
      const targetHashcode = generateEmailDateHashBase64(
        createPhishingDto.targetMail,
      );

      // Generate resetVersion (starting at 1 for new attempts)
      const resetVersion = INITIAL_RESET_VERSION;

      // Set token expiration (default: 1 day from now)
      const tokenExpiry = new Date();
      tokenExpiry.setDate(tokenExpiry.getDate() + TOKEN_EXPIRY_DAYS);

      // Generate one-time use token with resetVersion
      const token = generatePhishingToken(targetHashcode, resetVersion);

      const target = await this.phishingTargetModel.create({
        targetMail: createPhishingDto.targetMail,
        targetHashcode: targetHashcode,
        resetVersion: resetVersion,
        tokenExpiry: tokenExpiry,
      });

      this.logger.log(
        `Phishing target created with ID: ${target._id}, hashcode: ${targetHashcode}`,
      );

      // Send email with the token
      try {
        await this.emailService.send(
          createPhishingDto.targetMail,
          createPhishingDto.targetName || 'Client',
          token,
        );
        this.logger.log(`Email sent successfully to: ${createPhishingDto.targetMail}`);
      } catch (emailError) {
        this.logger.error(
          `Failed to send email to ${createPhishingDto.targetMail}`,
          emailError instanceof Error ? emailError.stack : '',
        );
        // Continue even if email fails - target is still created
      }

      return target;
    } catch (error: any) {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern || {})[0];
        if (duplicateField === 'targetMail') {
          this.logger.warn(
            `Duplicate email attempt: ${createPhishingDto.targetMail}`,
          );
          throw new BadRequestException(
            `Target with email "${createPhishingDto.targetMail}" already exists`,
          );
        }
        if (duplicateField === 'targetHashcode') {
          this.logger.error('Hash conflict occurred - rare collision detected');
          throw new BadRequestException(
            `Hash conflict occurred. Please try again.`,
          );
        }
      }
      this.logger.error(
        `Error creating phishing attempt: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
