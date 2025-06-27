import joi from 'joi';

export const userRegisterRequestSchema = joi.object({
  body: joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  })
});

export const getUserByIdRequestSchema = joi.object({
  params: joi.object({
    userId: joi.string().length(24).required(),
  })
});

export const userUpdateRequestSchema = joi.object({
  body: joi.object({
    name: joi.string().min(3),
    email: joi.string().email(),
    password: joi.string().min(6),
  })
});
