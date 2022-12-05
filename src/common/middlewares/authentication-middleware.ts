import { NextFunction, Response, Request } from 'express';
import { decrypt } from '../../infra/cryptography/jwt';
import { HttpStatusCode } from '../helpers/enum-helper';

const cleanToken = (token: string) => token.split(' ')[1];

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const { headers: { authorization } } = req;
  if (!authorization) {
    return res.status(401).json({ error: 'missing auth token' });
  }
  try {
    const token: string = cleanToken(authorization);
    const payload = await decrypt(token);
    
    if (!payload) {
      return next({ code: HttpStatusCode.UNAUTHORIZED, error: 'jwt malformed' });
    }

    req.payload = payload;

    return next();
  } catch (error) {
    return next({ code: HttpStatusCode.UNAUTHORIZED, error: error.message });
  }
};
