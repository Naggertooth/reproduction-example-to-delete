/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';

import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'nestjs-prisma';
import { User } from 'src/users/models/user.model';

import { CreateRoleInput } from './dto/create-role.input';
import { RemoveRoleInput } from './dto/remove-role.input';
import { RenameRoleInput } from './dto/rename-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService, private i18n: I18nService) {}

  create(createRoleInput: CreateRoleInput) {
    return this.prisma.roles.create({ data: { ...createRoleInput } });
  }

  async findAll() {
    return this.prisma.roleNames.findMany({
      include: { roles: false, _count: false },
    });
  }

  findOne(id: number) {
    this.prisma.roleNames.findUnique({
      include: { roles: false },
      where: { id },
    });
  }

  update(updateRoleInput: UpdateRoleInput) {
    return this.prisma.roles.update({
      where: {
        userId_roleId: updateRoleInput,
      },
      data: {
        roleId: updateRoleInput.newRoleId,
      },
    });
  }

  rename(renameRoleInput: RenameRoleInput) {
    return this.prisma.roleNames.update({
      where: {
        id: renameRoleInput.id,
      },
      data: {
        name: renameRoleInput.name,
      },
    });
  }

  async quantityOfRolesAssignedToUser(userId: User['id']) {
    return await this.prisma.roles.count({
      where: { userId },
    });
  }

  remove(removeRoleInput: RemoveRoleInput) {
    return this.prisma.roles.delete({
      where: { userId_roleId: removeRoleInput },
    });
  }
}
