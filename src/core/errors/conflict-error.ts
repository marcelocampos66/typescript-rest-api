import { HttpStatusCode } from '../helpers/http';
import { GenericError } from './generic-error';

export class ConflictError extends GenericError {
  constructor(message: string) {
    super(HttpStatusCode.CONFLICT, message);
  }
}
