import joi from 'joi';

export const joiUserRegister = joi.object({
  body: joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().required(),
    birthdate: joi.date().raw().required(),
    password: joi.string().min(6).required(),
  })
});

export const joiGetUserById = joi.object({
  params: joi.object({
    userId: joi.string().length(24).required(),
  })
});
