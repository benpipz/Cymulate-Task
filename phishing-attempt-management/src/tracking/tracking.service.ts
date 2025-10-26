import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetDocument,
} from './entities/tracking.entity';
import { Model } from 'mongoose';

@Injectable()
export class TrackingService {
  constructor(
    @InjectModel(PhishingTarget.name)
    private phishingTargetModel: Model<PhishingTargetDocument>,
  ) {}

  async hashCode(hashCode: string) {
    const target = await this.phishingTargetModel
      .findOneAndUpdate(
        { targetHashcode: hashCode },
        { status: 'clicked' },
        { new: true }, // return the updated document
      )
      .exec();
    if (!target) {
      // If not found, throw a clear exception
      throw new NotFoundException(`No target found with hashcode: ${hashCode}`);
    }
  }
}
