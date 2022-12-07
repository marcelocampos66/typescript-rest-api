import jwt from  'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || '';

export const encrypt = async (payload: object): Promise<string> => {
  return jwt.sign(payload, SECRET, { algorithm: 'HS256', expiresIn: '12h' });
}

export const decrypt = async (token: string): Promise<Payload> => {
  return jwt.verify(token, SECRET) as Payload;
}

export const decode = async (token: string): Promise<jwt.JwtPayload> => {
  return jwt.decode(token, { json: true });
}
