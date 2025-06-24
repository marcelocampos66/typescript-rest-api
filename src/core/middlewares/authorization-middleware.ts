import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors';

export const authorizationMiddleware = async (roles: any) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    // TODO -> when app has roles, put the role on auth payload and validate on this middleware

    next();
  }
}
