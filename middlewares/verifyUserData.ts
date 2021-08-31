import { Request, Response, NextFunction } from 'express';
import joi from 'joi';

const verifyUserData = (userData: IUserData) => (
  joi.object({
    email: joi.string().email().required(),
    name: joi.string().min(3).required(),
    birthdate: joi.date().raw().required(),
    password: joi.string().min(6).required(),
  }).validate(userData)
);

export default (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const { error } = verifyUserData(body);
  if (error) {
    return next({ status: 422, message: error.details[0].message });
  }
  return next();
};
