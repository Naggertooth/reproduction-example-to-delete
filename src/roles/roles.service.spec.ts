import { Test, TestingModule } from '@nestjs/testing';

import { defaultTestingModuleImports } from 'src/utils/testing/imports';

import { RolesService } from './roles.service';

describe('RolesService', () => {
  let service: RolesService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...defaultTestingModuleImports],
      providers: [RolesService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  afterAll(() => {
    module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
