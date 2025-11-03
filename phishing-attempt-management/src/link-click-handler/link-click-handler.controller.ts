import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Logger,
} from '@nestjs/common';
import { PhishingClickTrackingService } from './link-click-handler.service';
import { TrackingResponseDto } from './dto/tracking-response.dto';

/**
 * Controller for handling phishing link clicks
 * Processes one-time use tokens and tracks user interactions
 */
@Controller('tracking')
export class PhishingClickTrackingController {
  private readonly logger = new Logger(PhishingClickTrackingController.name);

  constructor(
    private readonly trackingService: PhishingClickTrackingService,
  ) {}

  /**
   * Track a phishing link click
   * Validates token and updates attempt status if valid
   * @param token - One-time use token containing hashcode and resetVersion
   * @returns { status: 'expired' } if token is invalid/used, or empty response if valid
   */
  @Get(':token')
  @HttpCode(HttpStatus.OK)
  async trackClick(
    @Param('token') token: string,
  ): Promise<TrackingResponseDto | void> {
    this.logger.debug(`Tracking click for token: ${token.substring(0, 20)}...`);
    const result = await this.trackingService.trackClickByToken(token);

    // If result is null, it was a valid click - return nothing (empty response)
    // If result has status 'expired', return the expired response
    return result || undefined;
  }
}

