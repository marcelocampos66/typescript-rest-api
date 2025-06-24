import { model } from 'mongoose';
import { userSchema } from '../schemas';
import { User } from '../entities';

export const UserModel = model<User>('User', userSchema);
