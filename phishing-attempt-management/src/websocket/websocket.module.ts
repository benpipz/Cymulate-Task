import { Module } from '@nestjs/common';
import { PhishingAttemptsGateway } from './websocket.gateway';
import { WebSocketService } from './websocket.service';

@Module({
  providers: [PhishingAttemptsGateway, WebSocketService],
  exports: [PhishingAttemptsGateway],
})
export class WebSocketModule {}

