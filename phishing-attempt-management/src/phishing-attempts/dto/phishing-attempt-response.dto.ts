import { Exclude, Expose } from 'class-transformer';

export class PhishingAttemptResponseDto {
  @Expose()
  _id: string;

  @Expose()
  targetMail: string;

  @Expose()
  targetHashcode: string;

  @Expose()
  status: 'created' | 'clicked';

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  resetVersion: number;

  @Exclude()
  tokenExpiry: Date;

  @Exclude()
  __v: number;

  constructor(partial: Partial<PhishingAttemptResponseDto>) {
    Object.assign(this, partial);
  }
}

