import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PhishingAttemptsService } from './phishing-attempts.service';
import { PhishingAttemptResponseDto } from './dto/phishing-attempt-response.dto';
import { plainToInstance } from 'class-transformer';

/**
 * Controller for managing phishing attempts
 * Provides endpoints to view and manage all phishing simulation attempts
 */
@Controller('phishing-attempts')
export class PhishingAttemptsController {
  private readonly logger = new Logger(PhishingAttemptsController.name);

  constructor(
    private readonly phishingAttemptsService: PhishingAttemptsService,
  ) {}

  /**
   * Get all phishing attempts
   * @returns Array of phishing attempts sorted by creation date (newest first)
   */
  @Get()
  async findAll(): Promise<PhishingAttemptResponseDto[]> {
    this.logger.debug('Fetching all phishing attempts');
    const attempts = await this.phishingAttemptsService.findAll();
    
    // Exclude sensitive fields from response
    return attempts.map((attempt) =>
      plainToInstance(PhishingAttemptResponseDto, attempt, {
        excludeExtraneousValues: true,
      }),
    );
  }

  /**
   * Delete all phishing attempts from the database
   * ⚠️ WARNING: This action is irreversible
   * @returns Deletion result with count of deleted records
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAll(): Promise<{ message: string; deletedCount: number }> {
    this.logger.warn('Bulk delete requested - removing all phishing attempts');
    return this.phishingAttemptsService.deleteAll();
  }
}
