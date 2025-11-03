import { Module } from '@nestjs/common';
import { PhishingEmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PhishingEmailService],
  exports: [PhishingEmailService],
})
export class PhishingEmailModule {}
