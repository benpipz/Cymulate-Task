import { Module } from '@nestjs/common';
import { PhishingClickTrackingService } from './link-click-handler.service';
import { PhishingClickTrackingController } from './link-click-handler.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PhishingTarget,
  PhishingTargetSchema,
} from './entities/phishing-target.entity';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhishingTarget.name, schema: PhishingTargetSchema },
    ]),
    WebSocketModule,
  ],
  controllers: [PhishingClickTrackingController],
  providers: [PhishingClickTrackingService],
})
export class LinkClickHandlerModule {}

