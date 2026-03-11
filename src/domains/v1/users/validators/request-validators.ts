import joi from 'joi';
import { JoiValidator } from '../../../../application/validators/joi-validator';

export const getUsersRequestValidator = new JoiValidator(
  joi.object({
    query: joi.object({
      page: joi.number().required(),
      size: joi.number().required(),
    })
  })
);

export const getUserByIdRequestValidator = new JoiValidator(
  joi.object({
    params: joi.object({
      userId: joi.string().length(24).required(),
    })
  })
);

export const userRegisterRequestValidator = new JoiValidator(
  joi.object({
    body: joi.object({
      name: joi.string().min(3).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    })
  })
);

export const userUpdateRequestValidator = new JoiValidator(
  joi.object({
    body: joi.object({
      name: joi.string().min(3),
      email: joi.string().email(),
      password: joi.string().min(6),
    })
  })
);
