import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePhishingDto } from './dto/create-phishing.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetDocument,
} from './entities/phishing.entity';
import { Model } from 'mongoose';
import { generateMailDateHashBase64 } from '../common/utils/hash.util';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class PhishingService {
  constructor(
    @InjectModel(PhishingTarget.name)
    private phishingTargetModel: Model<PhishingTargetDocument>,
    private emailService: EmailService,
  ) {}

  async create(createPhishingDto: CreatePhishingDto) {
    try {
      const targetHashcode = generateMailDateHashBase64(
        createPhishingDto.targetMail,
      );
      const target = await this.phishingTargetModel.create({
        targetMail: createPhishingDto.targetMail,
        targetHashcode: targetHashcode,
      });
      const mail = await this.emailService.send(
        createPhishingDto.targetMail,
        createPhishingDto.targetName,
        targetHashcode,
      );
      return target;
    } catch (err) {
      if (err.code === 11000) {
        if (err.keyPattern?.targetMail) {
          throw new BadRequestException(
            `Target with email "${createPhishingDto.targetMail}" already exists`,
          );
        }
        if (err.keyPattern?.targetHashcode) {
          throw new BadRequestException(
            `Hash conflict occurred. Please try again.`,
          );
        }
      }
      throw err;
    }
  }
}
