import joi from 'joi';

export const authRequestSchema = joi.object({
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  })
});
