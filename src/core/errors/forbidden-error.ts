import { HttpStatusCode } from '../helpers/http';
import { GenericError } from './generic-error';

export class ForbiddenError extends GenericError {
  constructor(message: string) {
    super(HttpStatusCode.FORBIDDEN, message);
  }
}
