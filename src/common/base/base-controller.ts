import { httpResponse } from '../helpers/http-helper';
import { HttpStatusCode } from '../helpers/enum-helper';
import { HttpResponse } from '../protocols';

export class Controller {
  public async httpResponse(status: number, body: unknown): Promise<HttpResponse> {
    return httpResponse(status, body);
  }

  public async handleError(error: Error): Promise<HttpResponse> {
    return httpResponse(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      { error: error.message },
    );
  }
}