import { Test, TestingModule } from '@nestjs/testing';
import { PhishingClickTrackingController } from './link-click-handler.controller';
import { PhishingClickTrackingService } from './link-click-handler.service';

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

