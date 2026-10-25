import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsEcritesController } from './questions-ecrites.controller';

describe('QuestionsEcritesController', () => {
  let controller: QuestionsEcritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsEcritesController],
    }).compile();

    controller = module.get<QuestionsEcritesController>(QuestionsEcritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
