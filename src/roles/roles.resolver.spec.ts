import { Test, TestingModule } from '@nestjs/testing';

import { I18nContext, I18nService } from 'nestjs-i18n';
import { PrismaService } from 'nestjs-prisma';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { defaultTestingModuleImports } from 'src/utils/testing/imports';

import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';

const mockRolesAll = [
  {
    id: 1n,
    name: 'ADMIN',
  },
  {
    id: 2n,
    name: 'GUEST',
  },
];

describe('RolesResolver', () => {
  let resolver: RolesResolver;
  let module: TestingModule;
  let prisma: PrismaService;
  let i18nService: I18nService<I18nTranslations>;
  let i18nContext: I18nContext<I18nTranslations>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...defaultTestingModuleImports],
      providers: [RolesResolver, RolesService],
    }).compile();

    resolver = module.get<RolesResolver>(RolesResolver);

    prisma = module.get<PrismaService>(PrismaService);
    i18nService = module.get<I18nService<I18nTranslations>>(I18nService);

    i18nContext = new I18nContext('en', i18nService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await module.close();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('Unit testing roles', () => {
    describe('querying', () => {
      it('should get all role names', async () => {
        prisma.roles.findMany = jest.fn().mockReturnValueOnce(mockRolesAll);

        const r = await resolver.findAll();

        expect(r).toEqual(mockRolesAll);
      });
    });

    describe('mutating', () => {
      it('should fail on roleRemoveRelation method because user has to have at least one role', async () => {
        prisma.roles.count = jest.fn().mockReturnValueOnce(1);

        try {
          await resolver.roleRemoveRelation(i18nContext, {
            roleId: 1,
            userId: 'cuid',
          });
        } catch (error) {
          expect(error.status).toBe(400);
          expect(error.message).toBe(
            i18nService.t('translation.errors.roles.remove.theLastOne')
          );
        }
      });
    });
  });
});
