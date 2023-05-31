import {
  Field,
  InputType,
  IntersectionType,
  registerEnumType,
} from '@nestjs/graphql';

import { Order } from 'src/common/order/order';
import { PaginationConnectorInput } from 'src/common/pagination/pagination.args';

export enum PostOrderField {
  id = 'id',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  published = 'published',
  title = 'title',
  content = 'content',
}

registerEnumType(PostOrderField, {
  name: 'PostOrderField',
  description: 'Properties by which post connections can be ordered.',
});

@InputType()
export class PostOrder extends Order {
  field: PostOrderField;
}

@InputType()
export class PostOrderType {
  orderBy: PostOrder;
}

@InputType()
export class PostsPaginationConnectorInput extends IntersectionType(
  PaginationConnectorInput,
  PostOrderType
) {
  @Field(() => String, {
    nullable: true,
    description: 'Query to search by title',
  })
  query: string;
}
