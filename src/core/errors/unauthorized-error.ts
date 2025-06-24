import { HttpStatusCode } from '../helpers/http';
import { GenericError } from './generic-error';

export class UnauthorizedError extends GenericError {
  constructor(message: string) {
    super(HttpStatusCode.UNAUTHORIZED, message);
  }
}
