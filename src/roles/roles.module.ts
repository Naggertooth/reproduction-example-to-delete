import { Module } from '@nestjs/common';

import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';

@Module({
  imports: [],
  providers: [RolesResolver, RolesService],
})
export class RolesModule {}
