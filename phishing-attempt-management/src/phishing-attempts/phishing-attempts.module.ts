import { Module } from '@nestjs/common';
import { PhishingAttemptsService } from './phishing-attempts.service';
import { PhishingAttemptsController } from './phishing-attempts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetSchema,
} from 'src/link-click-handler/entities/phishing-target.entity';
import { LinkClickHandlerModule } from 'src/link-click-handler/link-click-handler.module';

@Module({
  imports: [
    LinkClickHandlerModule,
    MongooseModule.forFeature([
      { name: PhishingTarget.name, schema: PhishingTargetSchema },
    ]),
  ],
  controllers: [PhishingAttemptsController],
  providers: [PhishingAttemptsService],
})
export class PhishingAttemptsModule {}
