/* eslint-disable prettier/prettier */

import { Schema, Document } from 'mongoose';

export interface Role extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
}

export const RoleSchema = new Schema<Role>({
  name: { type: String, required: true, unique: true },
});
