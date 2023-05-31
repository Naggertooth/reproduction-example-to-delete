import {
  Field,
  InputType,
  IntersectionType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';

import { Order } from 'src/common/order/order';
import { PaginationConnectorInput } from 'src/common/pagination/pagination.args';

export enum UserOrderField {
  id = 'id',
  email = 'email',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  firstname = 'firstname',
  lastname = 'lastname',
}

registerEnumType(UserOrderField, {
  name: 'UserOrderField',
  description: 'Properties by which User connections can be ordered.',
});

@InputType()
export class UserOrder extends Order {
  field: UserOrderField;
}

@InputType()
export class UserOrderType {
  orderBy: UserOrder;
}

@InputType()
export class UsersPaginationConnectorInput extends IntersectionType(
  PaginationConnectorInput,
  PartialType(UserOrderType)
) {
  @Field(() => String, {
    nullable: true,
    description: 'Query to search by email',
  })
  query: string | null;
}
