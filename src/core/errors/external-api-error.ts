import { HttpStatusCode } from '../helpers/http';
import { GenericError } from './generic-error';

export class ExternalApiError extends GenericError {
  constructor(message: string, statusCode: number = HttpStatusCode.SERVICE_UNAVAILABLE) {
    super(statusCode, message);
  }
}
