import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsEcritesService } from './questions-ecrites.service';

describe('QuestionsEcritesService', () => {
  let service: QuestionsEcritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsEcritesService],
    }).compile();

    service = module.get<QuestionsEcritesService>(QuestionsEcritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
