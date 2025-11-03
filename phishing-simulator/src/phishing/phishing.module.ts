import { Module } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { PhishingController } from './phishing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetSchema,
} from './entities/phishing.entity';
import { PhishingEmailModule } from 'src/phishing-email/phishing-email.module';

@Module({
  imports: [
    PhishingEmailModule,
    MongooseModule.forFeature([
      { name: PhishingTarget.name, schema: PhishingTargetSchema },
    ]),
  ],
  controllers: [PhishingController],
  providers: [PhishingService],
})
export class PhishingModule {}
