import bcrypt from 'bcrypt';

const SALT = 10

export const hash = async (text: string): Promise<string> => {
  return bcrypt.hash(text, SALT);
}

export const compare = async (text: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(text, hash);
}
