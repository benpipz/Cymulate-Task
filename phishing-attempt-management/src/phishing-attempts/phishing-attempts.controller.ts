import { Controller, Get } from '@nestjs/common';
import { PhishingAttemptsService } from './phishing-attempts.service';

@Controller('phishing-attempts')
export class PhishingAttemptsController {
  constructor(
    private readonly phishingAttemptsService: PhishingAttemptsService,
  ) {}

  @Get()
  findAll() {
    return this.phishingAttemptsService.findAll();
  }
}
