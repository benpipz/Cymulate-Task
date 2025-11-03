import { Test, TestingModule } from '@nestjs/testing';
import { PhishingClickTrackingService } from './link-click-handler.service';

describe('PhishingClickTrackingService', () => {
  let service: PhishingClickTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhishingClickTrackingService],
    }).compile();

    service = module.get<PhishingClickTrackingService>(PhishingClickTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

