import joi from 'joi';
import { JoiValidator } from '../../../../../../application/validators/joi-validator';

export const authRequestValidator = new JoiValidator(
  joi.object({
    body: joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    })
  })
);
