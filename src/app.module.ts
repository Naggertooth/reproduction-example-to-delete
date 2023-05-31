import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import { PrismaModule } from 'nestjs-prisma';
import * as path from 'path';
import { AuthModule } from 'src/auth/auth.module';
import config from 'src/common/configs/config';
import { loggingMiddleware } from 'src/common/middleware/logging.middleware';
import { PostsModule } from 'src/posts/posts.module';
import { UsersModule } from 'src/users/users.module';

import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { isTestEnv } from './common/configs/helper';
import { GqlConfigService } from './gql-config.service';
import { LocalizationsModule } from './localizations/localizations.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: [isTestEnv ? '.env.test' : '.env'],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
      },
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
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
        watch: true,
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

    AuthModule,
    LocalizationsModule,
    UsersModule,
    RolesModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
