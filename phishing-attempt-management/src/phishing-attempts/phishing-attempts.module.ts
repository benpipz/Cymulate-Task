import { Module } from '@nestjs/common';
import { PhishingAttemptsService } from './phishing-attempts.service';
import { PhishingAttemptsController } from './phishing-attempts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetSchema,
} from 'src/tracking/entities/tracking.entity';
import { TrackingModule } from 'src/tracking/tracking.module';

@Module({
  imports: [
    TrackingModule,
    MongooseModule.forFeature([
      { name: PhishingTarget.name, schema: PhishingTargetSchema },
    ]),
  ],
  controllers: [PhishingAttemptsController],
  providers: [PhishingAttemptsService],
})
export class PhishingAttemptsModule {}
