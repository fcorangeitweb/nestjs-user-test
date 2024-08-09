/* eslint-disable prettier/prettier */

import { Schema, Document } from 'mongoose';

export const RoleSchema = new Schema({
  name: { type: String, required: true },
});

export interface Role extends Document {
  name: string;
}
