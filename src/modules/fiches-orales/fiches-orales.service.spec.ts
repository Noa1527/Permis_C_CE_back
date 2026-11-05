import { Test, TestingModule } from '@nestjs/testing';
import { FichesOralesService } from './fiches-orales.service';

describe('FichesOralesService', () => {
  let service: FichesOralesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FichesOralesService],
    }).compile();

    service = module.get<FichesOralesService>(FichesOralesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
