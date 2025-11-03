import { Controller, Get, Param } from '@nestjs/common';
import { PhishingClickTrackingService } from './tracking.service';

@Controller('tracking')
export class PhishingClickTrackingController {
  constructor(private readonly trackingService: PhishingClickTrackingService) {}

  @Get(':hashCode')
  trackClick(@Param('hashCode') hashCode: string) {
    return this.trackingService.trackClickByHashCode(hashCode);
  }
}
