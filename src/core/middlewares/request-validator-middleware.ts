import { NextFunction, Response, Request } from 'express';
import joi from 'joi';
import { HttpStatusCode } from '../helpers/http';

export const requestValidatorMiddleware = (schema: joi.ObjectSchema) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { error } = schema.validate(request, { abortEarly: false, allowUnknown: true });
    if (error) {
      return response.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({ message: error.details[0].message });
    }
    return next();
  }
};
