import { Test, TestingModule } from '@nestjs/testing';
import { PhishingController } from './phishing.controller';
import { PhishingService } from './phishing.service';

describe('PhishingController', () => {
  let controller: PhishingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhishingController],
      providers: [PhishingService],
    }).compile();

    controller = module.get<PhishingController>(PhishingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
