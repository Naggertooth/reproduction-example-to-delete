import 'reflect-metadata';

import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { UserRole } from '@prisma/client';
import { BigIntResolver } from 'graphql-scalars';

import { Role } from './roles.model';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role',
});

@ObjectType()
export class RoleName {
  @Field(() => BigIntResolver)
  id: bigint;

  @Field(() => UserRole)
  name: UserRole;

  @Field(() => [Role])
  roles: [Role];
}
