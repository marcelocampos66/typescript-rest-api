import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatusCode } from '../helpers/enum-helper';

const { JWT_SECRET } = process.env;

const jwtSecret = (JWT_SECRET || '');

export default async (req: Request, res: Response, next: NextFunction) => {
  const { headers: { authorization } } = req;
  if (!authorization) {
    return res.status(401).json({ message: 'missing auth token' });
  }
  try {
    const payload = jwt.verify(authorization, jwtSecret) as jwt.JwtPayload;
    
    if (!payload) {
      return next({ code: 401, message: 'jwt malformed' });
    }

    req.payload = payload;

    return next();
  } catch (error) {
    return next({ code: 401, message: error.message });
  }
};
