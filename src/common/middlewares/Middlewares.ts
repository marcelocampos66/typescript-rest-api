import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import joi from 'joi';
import models from '../models/models';

class Middlewares {
  jwtSecret: Secret;
  payload: JwtPayload | string;
  private models = models;
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.payload = { id: '' , email: '', iat: 0, exp: 0 };
  }

  public verifyUserExists = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const { body: { email } } = req;
    const user = await this.models.users.getUserByEmail(email);
    if (user) {
      return next({ status: 403, message: 'User already exists' });
    }
    return next();
  };

  public validateJWT = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { headers: { authorization } } = req;
    if (!authorization) {
      return res.status(401).json({ message: 'missing auth token' });
    }
    try {
      const payload= jwt.verify(authorization, this.jwtSecret);
      if (!payload) {
        return next({ code: 401, message: 'jwt malformed' });
      }
      this.payload = payload;
      // req.payload = payload;
      return next();
    } catch (error) {
      return next({ code: 401, message: error.message });
    }
  };

}

export default Middlewares;
