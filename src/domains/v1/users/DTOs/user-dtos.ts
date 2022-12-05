export type userDTO = {
  name: string;
  email: string;
  birthdate: string;
  password: string;
}

export type userUpdateDTO = {
  name?: string;
  birthdate?: string;
  password?: string;
}

