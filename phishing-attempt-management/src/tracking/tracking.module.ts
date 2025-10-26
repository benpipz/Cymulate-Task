import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetSchema,
} from './entities/tracking.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhishingTarget.name, schema: PhishingTargetSchema },
    ]),
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
