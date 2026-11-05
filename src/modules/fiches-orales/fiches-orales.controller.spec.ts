import { Test, TestingModule } from '@nestjs/testing';
import { FichesOralesController } from './fiches-orales.controller';

describe('FichesOralesController', () => {
  let controller: FichesOralesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FichesOralesController],
    }).compile();

    controller = module.get<FichesOralesController>(FichesOralesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
