import { Test, TestingModule } from '@nestjs/testing';
import { PhishingClickTrackingController } from './tracking.controller';
import { PhishingClickTrackingService } from './tracking.service';

describe('PhishingClickTrackingController', () => {
  let controller: PhishingClickTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhishingClickTrackingController],
      providers: [PhishingClickTrackingService],
    }).compile();

    controller = module.get<PhishingClickTrackingController>(PhishingClickTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
