import { Field, InputType, Int } from '@nestjs/graphql';

import { UserRole } from '@prisma/client';

@InputType()
export class RenameRoleInput {
  @Field(() => Int, {
    description: 'ID of role',
  })
  id: number;

  @Field(() => UserRole, {
    description: 'New name for role',
  })
  name: UserRole;
}
