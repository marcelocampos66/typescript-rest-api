import { httpResponse, HttpStatusCode } from '../helpers/http';
import { Middleware, Validator } from '../protocols';

export class RequestValidatorMiddleware implements Middleware {
  public async handle(request: unknown, validator: Validator) {
    const { isValid, errorMessage } = validator.validate(request);
    if (!isValid) {
      return httpResponse(HttpStatusCode.UNPROCESSABLE_ENTITY, { message: errorMessage });
    }

    return httpResponse(HttpStatusCode.OK);
  }
}
