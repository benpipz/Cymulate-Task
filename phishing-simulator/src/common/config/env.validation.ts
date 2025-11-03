import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEmail,
  ValidateIf,
  validateSync,
} from 'class-validator';
import { Logger } from '@nestjs/common';

/**
 * Environment variables validation schema
 */
class EnvironmentVariables {
  @IsString()
  MONGO_URI: string;

  @ValidateIf((o) => o.SOURCE_EMAIL)
  @IsEmail()
  @IsOptional()
  SOURCE_EMAIL?: string;

  @IsOptional()
  @IsString()
  GMAIL_APP_PASS?: string;

  @IsOptional()
  @IsString()
  PHISHING_LINK_BASE_URL?: string;

  @IsOptional()
  @IsString()
  FRONTEND_URL?: string;

  @IsOptional()
  @IsString()
  PORT?: string;
}

/**
 * Validates environment variables and throws if required ones are missing
 * @param config - Raw environment variables object
 */
export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const logger = new Logger('EnvironmentValidation');
    logger.error('Environment validation failed:', errors);
    throw new Error('Environment validation failed');
  }

  return validatedConfig;
}

