import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { CreatePhishingDto } from './dto/create-phishing.dto';
import { PhishingTargetResponseDto } from './dto/phishing-response.dto';
import { plainToInstance } from 'class-transformer';

/**
 * Controller for managing phishing simulation attempts
 * Handles creation of new phishing campaigns
 */
@Controller('phishing')
export class PhishingController {
  private readonly logger = new Logger(PhishingController.name);

  constructor(private readonly phishingService: PhishingService) {}

  /**
   * Create a new phishing simulation attempt
   * @param createPhishingDto - DTO containing target email and optional name
   * @returns Created phishing target with secure token
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPhishingDto: CreatePhishingDto,
  ): Promise<PhishingTargetResponseDto> {
    this.logger.log(
      `Creating phishing attempt for: ${createPhishingDto.targetMail}`,
    );
    const target = await this.phishingService.create(createPhishingDto);
    
    // Exclude sensitive fields from response
    // Convert Mongoose document to plain object
    const targetObject = target.toObject ? target.toObject() : JSON.parse(JSON.stringify(target));
    return plainToInstance(PhishingTargetResponseDto, targetObject, {
      excludeExtraneousValues: true,
    });
  }
}
