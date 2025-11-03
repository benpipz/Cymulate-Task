import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetDocument,
} from './entities/phishing-target.entity';
import { Model } from 'mongoose';
import { decodePhishingToken } from '../common/utils/token.util';
import { PhishingAttemptsGateway } from '../websocket/websocket.gateway';

@Injectable()
export class PhishingClickTrackingService {
  private readonly logger = new Logger(PhishingClickTrackingService.name);

  constructor(
    @InjectModel(PhishingTarget.name)
    private phishingTargetModel: Model<PhishingTargetDocument>,
    private gateway: PhishingAttemptsGateway,
  ) {}

  async trackClickByToken(token: string): Promise<{ status: 'expired' } | null> {
    this.logger.debug(`Processing click tracking for token (length: ${token.length})`);
    
    // Decode URL-encoded token (browser might encode special characters)
    let decodedToken: string;
    try {
      decodedToken = decodeURIComponent(token);
    } catch (error) {
      // If already decoded or invalid encoding, use as-is
      decodedToken = token;
    }
    
    // Decode the token to extract hashcode and resetVersion
    const decoded = decodePhishingToken(decodedToken);
    if (!decoded) {
      this.logger.warn('Invalid token format received');
      return { status: 'expired' };
    }

    const { hashcode, resetVersion } = decoded;
    this.logger.debug(`Decoded token - hashcode: ${hashcode}, resetVersion: ${resetVersion}`);

    // Find the target by hashcode
    const target = await this.phishingTargetModel
      .findOne({ targetHashcode: hashcode })
      .exec();

    if (!target) {
      this.logger.warn(`Target not found for hashcode: ${hashcode}`);
      return { status: 'expired' };
    }

    // Check if token is expired
    const now = new Date();
    if (target.tokenExpiry < now) {
      this.logger.warn(`Token expired for target: ${target._id}`);
      return { status: 'expired' };
    }

    // Check if resetVersion matches what's in the database
    // If it doesn't match, token has already been used
    if (target.resetVersion !== resetVersion) {
      this.logger.warn(
        `Token already used - resetVersion mismatch. Expected: ${target.resetVersion}, Got: ${resetVersion}`,
      );
      return { status: 'expired' };
    }

    // Check if already clicked (additional safety check)
    if (target.status === 'clicked') {
      this.logger.warn(`Target already clicked: ${target._id}`);
      return { status: 'expired' };
    }

    // Update status to clicked and increment resetVersion to prevent reuse
    const updatedTarget = await this.phishingTargetModel
      .findOneAndUpdate(
        {
          targetHashcode: hashcode,
          resetVersion: resetVersion, // Ensure resetVersion still matches
          status: 'created', // Only update if status is still 'created'
        },
        {
          status: 'clicked',
          $inc: { resetVersion: 1 }, // Increment resetVersion to invalidate token
        },
        { new: true },
      )
      .exec();

    if (!updatedTarget) {
      // Token was used between check and update (race condition) - return expired
      this.logger.warn(
        `Race condition detected - token already used for hashcode: ${hashcode}`,
      );
      return { status: 'expired' };
    }

    // Valid click - emit WebSocket event
    this.logger.log(
      `Successfully tracked click for target: ${updatedTarget._id}, email: ${updatedTarget.targetMail}`,
    );
    
    // Emit WebSocket event for real-time updates
    this.gateway.emitAttemptClicked(updatedTarget);
    
    return null;
  }
}

