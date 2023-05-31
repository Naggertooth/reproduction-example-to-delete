import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import * as EnTranslationJSON from 'static/i18n/en/translation.json';
import * as request from 'supertest';

describe('LocalizationsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/localizations/en/translation.json (GET)', () => {
    return request(app.getHttpServer())
      .get('/localizations/en/translation.json')
      .expect(200)
      .expect(EnTranslationJSON);
  });
});
