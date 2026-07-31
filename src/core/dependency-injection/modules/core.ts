import { container } from '..';
import { MiddlewareInstanceTokens } from '../tokens';
import { AuthMiddleware, RequestValidatorMiddleware } from '../../middlewares';

export const registerCoreModule = () => {
  container.register<AuthMiddleware>(
    MiddlewareInstanceTokens.AUTH,
    AuthMiddleware
  );
  container.register<RequestValidatorMiddleware>(
    MiddlewareInstanceTokens.REQUEST_VALIDATOR,
    RequestValidatorMiddleware
  );
};
