import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { CreatePhishingDto } from './dto/create-phishing.dto';

@Controller('phishing')
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPhishingDto: CreatePhishingDto) {
    return this.phishingService.create(createPhishingDto);
  }
}
