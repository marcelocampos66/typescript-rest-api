import { model } from 'mongoose';
import { userSchema } from '../schemas';
import { User } from '../../../../domains/v1/users/entities';

export const UserModel = model<User>('User', userSchema);
