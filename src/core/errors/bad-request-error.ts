import { HttpStatusCode } from '../helpers/http';
import { GenericError } from './generic-error';

export class BadRequestError extends GenericError {
  constructor(message: string) {
    super(HttpStatusCode.BAD_REQUEST, message);
  }
}
