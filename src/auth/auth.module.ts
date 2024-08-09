/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from './schemas/user.schema';
import { RoleSchema } from './schemas/role.schema';
import { RoleService } from 'src/role/role.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
  ],
  providers: [AuthService,RoleService],
  controllers: [AuthController],
})
export class AuthModule {}
