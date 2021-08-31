import { Request, Response, NextFunction } from 'express';
import errorHandler from '../utils/ErrorHandler';

export default (
  err: errorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Ops, something bad happened';
  return res.status(status).json({ message });
};
