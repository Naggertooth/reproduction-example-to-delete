import { ObjectType, OmitType, PartialType } from '@nestjs/graphql';

import PaginatedResponse from 'src/common/pagination/pagination';

import { User } from './user.model';

@ObjectType()
class PartialUser extends PartialType(OmitType(User, ['posts'] as const)) {}

@ObjectType()
export class UserConnection extends PaginatedResponse(PartialUser) {}
