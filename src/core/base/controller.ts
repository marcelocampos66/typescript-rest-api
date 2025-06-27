import { GenericError } from '../errors';
import { httpResponse } from '../helpers/http';
import { HttpStatusCode } from '../helpers/http';
import { HttpResponse } from '../protocols';

export class Controller {
  protected async httpResponse(status: number, body?: unknown): Promise<HttpResponse> {
    return httpResponse(status, body);
  }

  protected async handleError(error: GenericError): Promise<HttpResponse> {
    if (error.statusCode) {
      return this.httpResponse(error.statusCode, { message: error.message })
    }

    return this.httpResponse(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      { message: error.message },
    );
  }
}