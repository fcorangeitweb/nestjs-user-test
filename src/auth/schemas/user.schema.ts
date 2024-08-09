/* eslint-disable prettier/prettier */

import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
});

export interface User extends Document {
  username: string;
  password: string;
  roles: string[];
}
