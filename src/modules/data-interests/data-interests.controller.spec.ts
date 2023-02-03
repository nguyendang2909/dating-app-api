import { Test, TestingModule } from '@nestjs/testing';

import { InterestsController } from './data-interests.controller';
import { InterestsService } from './data-interests.service';

describe('InterestsController', () => {
  let controller: InterestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestsController],
      providers: [InterestsService],
    }).compile();

    controller = module.get<InterestsController>(InterestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
