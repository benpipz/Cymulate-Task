import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class CreatePhishingDto {
  @IsNotEmpty({ message: 'User email is required' })
  @IsString({ message: 'User email must be a string' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.trim().toLowerCase()) // normalize input
  targetMail: string;

  @IsString({ message: 'Target name must be a string' })
  @Optional()
  targetName: string = 'Client';
}
