import 'reflect-metadata';

import { Field, ObjectType } from '@nestjs/graphql';

import { User } from 'src/users/models/user.model';

import { RoleName } from './roleNames.model';

@ObjectType()
export class Role {
  @Field()
  userId: string;

  @Field()
  roleId: number;

  @Field(() => [User])
  user: [User];

  @Field(() => [RoleName])
  roleName: [RoleName];
}
