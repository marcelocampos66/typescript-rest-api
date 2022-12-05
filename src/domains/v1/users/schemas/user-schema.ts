import { Schema } from 'mongoose';
import { userDTO } from '../DTOs';

export const userSchema = new Schema<userDTO>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  birthdate: { type: String, required: true },
  password: { type: String, required: true },
});
