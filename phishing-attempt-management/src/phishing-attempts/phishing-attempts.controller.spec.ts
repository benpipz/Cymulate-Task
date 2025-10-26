import { Test, TestingModule } from '@nestjs/testing';
import { PhishingAttemptsController } from './phishing-attempts.controller';
import { PhishingAttemptsService } from './phishing-attempts.service';

describe('PhishingAttemptsController', () => {
  let controller: PhishingAttemptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhishingAttemptsController],
      providers: [PhishingAttemptsService],
    }).compile();

    controller = module.get<PhishingAttemptsController>(PhishingAttemptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
