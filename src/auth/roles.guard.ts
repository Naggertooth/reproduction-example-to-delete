import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { UserRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private prisma: PrismaService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredUserRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredUserRoles) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    const user = req.user;
    const userRoles = (
      await this.prisma.roleNames.findMany({
        where: { roles: { some: { userId: user.id } } },
      })
    ).map((roleEntity) => roleEntity.name);

    if (user && userRoles.length) {
      return requiredUserRoles.some((r) => userRoles.includes(r));
    } else {
      return false;
    }
  }
}
