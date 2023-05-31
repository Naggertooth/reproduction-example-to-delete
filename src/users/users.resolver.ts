import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { UserRolesGuard } from 'src/auth/roles.guard';
import { UserRoles } from 'src/common/decorators/roles.decorator';
import { UserEntity } from 'src/common/decorators/user.decorator';

import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersPaginationConnectorInput } from './dto/user-connector.input';
import { User } from './models/user.model';
import { UserConnection } from './models/user-connection.model';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService
  ) {}

  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @Query(() => UserConnection, { name: 'users' })
  async findAll(@Args('input') input: UsersPaginationConnectorInput) {
    const { orderBy, after, before, first, last, skip, take, query } = input;
    const paginateWithoutCursorCondition = !first && !last && !before && !after;

    const a = await findManyCursorConnection(
      (args) =>
        this.prisma.user.findMany({
          include: { roles: true },
          where: {
            email: { contains: query || '' },
          },
          orderBy: orderBy ? { [orderBy.field]: orderBy.direction } : undefined,
          ...args,
          ...(paginateWithoutCursorCondition && { skip, take }),
        }),
      () =>
        this.prisma.user.count({
          where: {
            email: { contains: query || '' },
          },
        }),
      { first, last, before, after }
    );

    return a;
  }

  @Query(() => Int, { name: 'usersCount' })
  async countAll(@Args('input') input: UsersPaginationConnectorInput) {
    const { query } = input;

    return this.prisma.user.count({
      where: {
        email: { contains: query || '' },
      },
    });
  }

  @UserRoles(UserRole.ADMIN)
  @UseGuards(GqlAuthGuard, UserRolesGuard)
  @Mutation(() => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput
  ) {
    return this.usersService.updateUser(user.id, newUserData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.usersService.changePassword(
      user.id,
      user.password,
      changePassword
    );
  }

  @ResolveField('posts')
  posts(@Parent() author: User) {
    return this.prisma.user.findUnique({ where: { id: author.id } }).posts();
  }

  @ResolveField('roles')
  roles(@Parent() user: User) {
    return this.prisma.user.findUnique({ where: { id: user.id } }).roles();
  }
}
