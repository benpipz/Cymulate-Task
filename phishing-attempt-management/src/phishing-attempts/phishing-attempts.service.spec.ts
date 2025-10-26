import { Test, TestingModule } from '@nestjs/testing';
import { PhishingAttemptsService } from './phishing-attempts.service';

describe('PhishingAttemptsService', () => {
  let service: PhishingAttemptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhishingAttemptsService],
    }).compile();

    service = module.get<PhishingAttemptsService>(PhishingAttemptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
