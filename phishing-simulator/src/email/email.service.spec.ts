import { Test, TestingModule } from '@nestjs/testing';
import { PhishingEmailService } from './email.service';

describe('PhishingEmailService', () => {
  let service: PhishingEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhishingEmailService],
    }).compile();

    service = module.get<PhishingEmailService>(PhishingEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
