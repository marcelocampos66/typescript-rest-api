import { model } from 'mongoose';
import { userSchema } from '../schemas';
import { userDTO } from '../DTOs';

export const User = model<userDTO>('User', userSchema);
