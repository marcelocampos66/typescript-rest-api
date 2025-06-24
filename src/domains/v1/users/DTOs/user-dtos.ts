import { User } from "../entities";

export const userDTO = (data: User): User => {
  return new User({ ...data })
}

export const userUpdateDTO = (data: Partial<User>) => {
  return ({ ...data })
}
