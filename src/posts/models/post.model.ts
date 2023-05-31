import { Field, ObjectType } from '@nestjs/graphql';

import { BaseModel } from 'src/common/models/base.model';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Post extends BaseModel {
  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  content?: string | null;

  @Field(() => Boolean)
  published: boolean;

  @Field(() => User, { nullable: true })
  author?: User | null;
}
