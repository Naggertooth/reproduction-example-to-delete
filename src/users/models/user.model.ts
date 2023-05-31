import 'reflect-metadata';

import { Field, HideField, ObjectType } from '@nestjs/graphql';

import { IsEmail } from 'class-validator';
import { BaseModel } from 'src/common/models/base.model';
import { Post } from 'src/posts/models/post.model';
import { Role } from 'src/roles/models/roles.model';

@ObjectType()
export class User extends BaseModel {
  @Field()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  firstname?: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @Field(() => [Role])
  roles: [Role];

  @Field(() => [Post], { nullable: true })
  posts?: [Post] | null;

  @HideField()
  password: string;
}
