import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetDocument,
} from 'src/tracking/entities/tracking.entity';

@Injectable()
export class PhishingAttemptsService {
  constructor(
    @InjectModel(PhishingTarget.name)
    private phishingTargetModel: Model<PhishingTargetDocument>,
  ) {}

  async findAll() {
    const targets = await this.phishingTargetModel.find().lean().exec();
    return targets;
  }
}
