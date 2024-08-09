/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel('Role') private readonly roleModel: Model<Role>,
  ) {}

  async createRole(name: string): Promise<Role> {
    const existingRole = await this.roleModel.findOne({ name }).exec();
    if (existingRole) {
      return existingRole;
    }
    const newRole = new this.roleModel({ name });
    return newRole.save();
  }

  async createDefaultRoles(): Promise<void> {
    const roles = ['user', 'admin'];
    for (const roleName of roles) {
      await this.createRole(roleName);
    }
  }
}
