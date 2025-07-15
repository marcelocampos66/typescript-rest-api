import { injectable } from 'tsyringe';
import { HttpResponse, Middleware } from '../protocols';
import { httpResponse, HttpStatusCode } from '../helpers/http';
import { UnauthorizedError } from '../errors';

@injectable()
export class AuthorizationMiddleware implements Middleware {
  public async handle(_httpRequest: unknown) {
    return httpResponse(HttpStatusCode.OK, {});    
  }
}
