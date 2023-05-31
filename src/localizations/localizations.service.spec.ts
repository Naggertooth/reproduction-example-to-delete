import { Test, TestingModule } from '@nestjs/testing';

import { PathOrFileDescriptor, readFileSync } from 'fs';
import { join } from 'path';

import { LocalizationsService } from './localizations.service';

describe('LocalizationsService', () => {
  let service: LocalizationsService;
  let internalLanguagePath: string,
    internalNamespacePath: string,
    path: PathOrFileDescriptor,
    file: Buffer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalizationsService],
    }).compile();

    service = module.get<LocalizationsService>(LocalizationsService);

    internalLanguagePath = 'en';
    internalNamespacePath = 'translation.json';
    path = join(
      process.cwd(),
      `static/i18n/${internalLanguagePath}/${internalNamespacePath}`
    );
    file = readFileSync(path, {
      encoding: null,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('return localization', () => {
    it('should return en translation', async () => {
      const resolvedPath = service.getFilePath(
        internalLanguagePath,
        internalNamespacePath
      );
      const resolvedFile = readFileSync(resolvedPath, {
        encoding: null,
      });
      expect(resolvedFile).toStrictEqual(file);
    });
  });
});
