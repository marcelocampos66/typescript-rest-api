import joi from 'joi';
import { httpResponse, HttpStatusCode } from '../helpers/http';
import { Middleware } from '../protocols';

export class RequestValidatorMiddleware implements Middleware {
  async handle(request: unknown, schema: joi.ObjectSchema) {
    const { error } = schema.validate(request, { abortEarly: false, allowUnknown: true });
    if (error) {
      return httpResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, { message: error.details[0].message });
    }

    return httpResponse(HttpStatusCode.OK);
  }
}
