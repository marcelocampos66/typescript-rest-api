import { inject, injectable } from '../../core/dependency-injection';
import { httpResponse, HttpStatusCode } from '../helpers/http';
import { JwtCryptography } from '../../infra/cryptography';
import { CryptographyContainerInstanceTokens } from '../dependency-injection/tokens';
import { Middleware } from '../protocols';
import { UnauthorizedError } from '../errors';
import { AuthMiddlewareErrors } from "../helpers/enums";

@injectable()
export class AuthMiddleware implements Middleware {
  private readonly jwtCryptography: JwtCryptography;

  constructor(
    @inject(CryptographyContainerInstanceTokens.JWT_CRYPTO_HELPER) jwtCryptography: JwtCryptography,
  ) {
    this.jwtCryptography = jwtCryptography;
  }

  private cleanToken(token: string): string {
    return token.split(' ').pop();
  }

  public async handle(request: AuthMiddleware.Request) {
    try {
      if (!request.accessToken) {
        return httpResponse(HttpStatusCode.UNAUTHORIZED, { message: AuthMiddlewareErrors.MISSING_AUTH_TOKEN });
      }
      const token: string = this.cleanToken(request.accessToken);
      const payload = await this.jwtCryptography.decrypt(token);
      if (!payload) {
        return httpResponse(HttpStatusCode.UNAUTHORIZED, { message: AuthMiddlewareErrors.JWT_MALFORMED });
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
