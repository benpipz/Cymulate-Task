import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetDocument,
} from 'src/link-click-handler/entities/phishing-target.entity';

@Injectable()
export class PhishingAttemptsService {
  private readonly logger = new Logger(PhishingAttemptsService.name);

  constructor(
    @InjectModel(PhishingTarget.name)
    private phishingTargetModel: Model<PhishingTargetDocument>,
  ) {}

  async findAll(): Promise<PhishingTarget[]> {
    this.logger.debug('Fetching all phishing attempts');
    const targets = await this.phishingTargetModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    this.logger.log(`Retrieved ${targets.length} phishing attempts`);
    return targets;
  }

  async deleteAll(): Promise<{ message: string; deletedCount: number }> {
    this.logger.warn('Deleting all phishing attempts from database');
    const result = await this.phishingTargetModel.deleteMany({}).exec();
    this.logger.log(
      `Successfully deleted ${result.deletedCount} phishing attempts`,
    );
    return {
      message: 'All phishing attempts deleted successfully',
      deletedCount: result.deletedCount,
    };
  }
}
