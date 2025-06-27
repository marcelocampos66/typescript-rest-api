import { DefaultSchema } from './default-schema';
import { User } from '../../../../domains/v1/users/entities';

export const userSchema = new DefaultSchema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
