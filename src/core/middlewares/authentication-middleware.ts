import { inject, injectable } from 'tsyringe';
import { httpResponse, HttpStatusCode } from '../helpers/http';
import { JwtCryptography } from '../../infra/cryptography';
import { CryptographyContainerInstanceTokens } from '../helpers/enums';
import { HttpResponse, Middleware } from '../protocols';
import { UnauthorizedError } from '../errors';

@injectable()
export class AuthMiddleware implements Middleware {
  private readonly jwtCryptography: JwtCryptography;

  constructor(
    @inject(CryptographyContainerInstanceTokens.JWT_CRYPTO_HELPER) jwtCryptography,
  ) {
    this.jwtCryptography = jwtCryptography;
  }

  private cleanToken(token: string): string {
    return token.split(' ').pop();
  }

  public async handle(request: AuthMiddleware.Request) {
    try {
      if (!request.accessToken) {
        return httpResponse(HttpStatusCode.UNAUTHORIZED, { message: 'missing auth token' });
      }
      const token: string = this.cleanToken(request.accessToken);
      const payload = await this.jwtCryptography.decrypt(token);
      if (!payload) {
        return httpResponse(HttpStatusCode.UNAUTHORIZED, { message: 'jwt malformed' });
      }

      return httpResponse(HttpStatusCode.OK, { accessToken: request.accessToken, auth: payload });
    } catch (error) {
      throw new UnauthorizedError(error.message);
    }
  }
}


export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
