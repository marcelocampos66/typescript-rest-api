import { NextFunction, Response, Request } from 'express';
import joi from 'joi';
import { HttpStatusCode } from '../helpers/enum-helper';

export const joiMiddleware = (schema: joi.ObjectSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req, { abortEarly: false, allowUnknown: true });
    if (error) {
      return next({ status: HttpStatusCode.UNPROCESSABLE_ENTITY, message: error.details[0].message });
    }
    return next();
  }
};
