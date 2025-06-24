import { NextFunction, Response, Request } from 'express';
import { container } from 'tsyringe';
import { HttpStatusCode } from '../helpers/http';
import { JwtCryptography } from '../../infra/cryptography';
import { CryptographyContainerInstanceTokens } from '../helpers/enums';

const cleanToken = (token: string) => token.split(' ').pop();
const jwtCryptography: JwtCryptography = container.resolve(CryptographyContainerInstanceTokens.JWT_CRYPTO_HELPER)

export const authMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const { headers: { authorization } } = request;
  if (!authorization) {
    return response.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'missing auth token' });
  }
  try {
    const token: string = cleanToken(authorization);
    const payload = await jwtCryptography.decrypt(token);
    
    if (!payload) {
      return response.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'jwt malformed' });
    }

    request.auth = payload;

    return next();
  } catch (error) {
    return response.status(HttpStatusCode.UNAUTHORIZED).json({ message: error.message });
  }
};
