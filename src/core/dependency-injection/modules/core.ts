import { container } from '..';
import { MiddlewareIntanceTokens } from '../tokens';
import { AuthMiddleware } from '../../middlewares/authentication-middleware';
import { RequestValidatorMiddleware } from '../../middlewares/request-validator-middleware';

export const registerCoreModule = () => {
  container.register<AuthMiddleware>(
    MiddlewareIntanceTokens.AUTH,
    AuthMiddleware
  );
  container.register<RequestValidatorMiddleware>(
    MiddlewareIntanceTokens.REQUEST_VALIDATOR,
    RequestValidatorMiddleware
  );
};
