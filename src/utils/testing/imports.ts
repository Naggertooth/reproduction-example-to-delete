import { Logger } from '@nestjs/common';

import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import { PrismaModule } from 'nestjs-prisma';
import * as path from 'path';
import { loggingMiddleware } from 'src/common/middleware/logging.middleware';

export const defaultTestingModuleImports = [
  PrismaModule.forRoot({
    isGlobal: true,
    prismaServiceOptions: {
      middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
    },
  }),

  I18nModule.forRoot({
    fallbackLanguage: 'en',
    fallbacks: {
      'ru-*': 'ru',
      ru: 'ru',
      'en-*': 'en',
    },
    loaderOptions: {
      path: path.join(process.cwd(), '/static/i18n/'),
    },
    resolvers: [
      { use: HeaderResolver, options: ['accept_language'] },
      // loose means partial matching
      { use: AcceptLanguageResolver, options: { matchType: 'loose' } },
    ],
    typesOutputPath: path.join(
      process.cwd(),
      '/src/generated/i18n.generated.ts'
    ),
  }),
];
