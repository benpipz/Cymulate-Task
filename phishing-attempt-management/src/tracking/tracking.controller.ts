import { Controller, Get, Param } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get(':hashCode')
  Track(@Param('hashCode') hashCode: string) {
    return this.trackingService.hashCode(hashCode);
  }
}
