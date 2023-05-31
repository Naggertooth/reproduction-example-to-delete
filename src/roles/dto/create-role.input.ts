import { Field, InputType, Int } from '@nestjs/graphql';

/**
 * Sets new role relation for user
 */
@InputType()
export class CreateRoleInput {
  @Field(() => String, { description: 'User id' })
  userId: string;

  @Field(() => Int, {
    description: 'ID of role that is related to assigned user',
  })
  roleId: number;
}
