import { InputType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
export class RegularPaginationInput {
  skip?: number;

  take?: number;
}

@InputType({ isAbstract: true })
export class PaginationConnectorInput extends RegularPaginationInput {
  after?: string;

  before?: string;

  first?: number;

  last?: number;
}
