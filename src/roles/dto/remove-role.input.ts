import { Field, InputType, Int } from '@nestjs/graphql';

/**
 * Removes role relation for user
 */
@InputType()
export class RemoveRoleInput {
  @Field(() => String, { description: 'User id' })
  userId: string;

  @Field(() => Int, {
    description: 'ID of old role that will be removed from assigned user',
  })
  roleId: number;
}
