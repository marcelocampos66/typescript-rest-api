import { Request, Response, NextFunction } from 'express';
import { GenericError } from '../errors';

export const errorMiddleware = (
  err: GenericError,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Unexpected error';
  

  return response.status(statusCode).json({ message });
};
