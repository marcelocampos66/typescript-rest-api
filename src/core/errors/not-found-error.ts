import { HttpStatusCode } from '../helpers/http';
import { GenericError } from './generic-error';

export class NotFoundError extends GenericError {
  constructor(message: string) {
    super(HttpStatusCode.NOT_FOUND, message);
  }
}
