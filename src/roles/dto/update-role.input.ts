import { Field, InputType, Int } from '@nestjs/graphql';

/**
 * Sets new role relation for user
 */
@InputType()
export class UpdateRoleInput {
  @Field(() => String, { description: 'User id' })
  userId: string;

  @Field(() => Int, {
    description: 'ID of old role that is related to assigned user',
  })
  roleId: number;

  @Field(() => Int, {
    description: 'ID of new role that is related to assigned user',
  })
  newRoleId: number;
}
