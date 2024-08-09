/* eslint-disable prettier/prettier */
/*
 Copyright 2024 Nestjs

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from './schemas/user.schema';
import { Role } from './schemas/role.schema';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthService {
  private readonly jwtSecret = 'f8key_1';

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Role') private readonly roleModel: Model<Role>,
    private readonly roleService: RoleService,
  ) {}

  async register(
    username: string,
    password: string,
    roleNames: string[],
  ): Promise<User> {
    if (!Array.isArray(roleNames)) {
      throw new Error('roleNames must be an array');
    }

    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    if (roleNames.includes('admin') || roleNames.includes('superadmin')) {
      throw new BadRequestException('Opps,something error');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    for (const roleName of roleNames) {
      await this.roleService.createRole(roleName);
    }

    const roles = await this.roleModel
      .find({ name: { $in: roleNames } })
      .exec();

    if (roles.length === 0) {
      const defaultRole = await this.roleService.createRole('user');
      roles.push(defaultRole.toObject());
    }

    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      roles: roles.map((role) => role._id),
    });

    return newUser.save();
  }

  async login(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userModel
      .findOne({ username })
      .populate('roles')
      .exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      username: user.username,
      roles: user.roles.map((role: any) => role.name),
    };
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
    return { accessToken };
  }
}
