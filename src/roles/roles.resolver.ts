import { BadRequestException, UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { UserRole } from '@prisma/client';
import { I18n, I18nContext } from 'nestjs-i18n';
import { PrismaService } from 'nestjs-prisma';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserRolesGuard } from 'src/auth/roles.guard';
import { UserRoles } from 'src/common/decorators/roles.decorator';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { User } from 'src/users/models/user.model';

import { RemoveRoleInput } from './dto/remove-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { RoleName } from './models/roleNames.model';
import { Role } from './models/roles.model';
import { RolesService } from './roles.service';

@Resolver(() => Role)
@UseGuards(GqlAuthGuard)
export class RolesResolver {
  constructor(
    private readonly rolesService: RolesService,
    private prisma: PrismaService
  ) {}

  @UserRoles(UserRole.ADMIN)
  @UseGuards(GqlAuthGuard, UserRolesGuard)
  @Mutation(() => Role)
  createRole(@Args('createRoleInput') createRoleInput: UpdateRoleInput) {
    return this.rolesService.create(createRoleInput);
  }

  @Query(() => [RoleName], { name: 'roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Query(() => Role, { name: 'role' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.rolesService.findOne(id);
  }

  @UserRoles(UserRole.ADMIN)
  @UseGuards(GqlAuthGuard, UserRolesGuard)
  @Mutation(() => Role)
  roleUserRelationUpdate(
    @Args('updateRoleInput') updateRoleInput: UpdateRoleInput
  ) {
    return this.rolesService.update(updateRoleInput);
  }

  @UserRoles(UserRole.ADMIN)
  @UseGuards(GqlAuthGuard, UserRolesGuard)
  @Mutation(() => Role)
  roleRename(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
    return this.rolesService.update(updateRoleInput);
  }

  @UserRoles(UserRole.ADMIN)
  @UseGuards(GqlAuthGuard, UserRolesGuard)
  @Mutation(() => User, {
    description: 'Rename role to another from UserRole enum',
  })
  async roleRemoveRelation(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Args('removeRoleInput') removeRoleInput: RemoveRoleInput
  ) {
    const restrictCondition =
      (await this.rolesService.quantityOfRolesAssignedToUser(
        removeRoleInput.userId
      )) <= 1;

    // user has to have at least one role
    if (restrictCondition) {
      throw new BadRequestException(
        i18n.translate('translation.errors.roles.remove.theLastOne')
      );
    }

    return this.rolesService.remove(removeRoleInput);
  }

  @ResolveField('user', () => [User])
  async user(@Parent() role: Role) {
    return this.prisma.roles.findMany({
      where: { user: { id: role.userId } },
    });
  }

  @ResolveField('roleName', () => User)
  async roleName(@Parent() role: Role) {
    return this.prisma.roleNames.findMany({
      where: { id: role.roleId },
    });
  }
}
