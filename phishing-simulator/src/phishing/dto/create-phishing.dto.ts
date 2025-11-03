import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for creating a new phishing simulation attempt
 */
export class CreatePhishingDto {
  /**
   * Target email address for the phishing simulation
   * @example user@example.com
   */
  @IsNotEmpty({ message: 'Target email is required' })
  @IsString({ message: 'Target email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  targetMail: string;

  /**
   * Optional name of the target (defaults to "Client")
   * @example John Doe
   */
  @IsOptional()
  @IsString({ message: 'Target name must be a string' })
  @MaxLength(100, {
    message: 'Target name must be less than 100 characters',
  })
  @Transform(({ value }) => value?.trim())
  targetName?: string = 'Client';
}
