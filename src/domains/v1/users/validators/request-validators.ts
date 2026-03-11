import { z } from 'zod';
import { ZodValidator } from '../../../../application/validators/zod-validator';

export const getUsersRequestValidator = new ZodValidator(
  z.object({
    query: z.object({
      page: z.number(),
      size: z.number(),
    })
  })
);

export const getUserByIdRequestValidator = new ZodValidator(
  z.object({
    params: z.object({
      userId: z.string().length(24),
    })
  })
);

export const userRegisterRequestValidator = new ZodValidator(
  z.object({
    body: z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    })
  })
);

export const userUpdateRequestValidator = new ZodValidator(
  z.object({
    body: z.object({
      name: z.string().min(3).optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    })
  })
);
