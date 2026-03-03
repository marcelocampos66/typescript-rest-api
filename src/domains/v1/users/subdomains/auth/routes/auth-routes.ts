import { Router } from 'express';
import { container } from '../../../../../../core/dependency-injection';
import { routeAdapter, middlewareAdapter } from '../../../../../../application/adapters';
import { AuthController } from '../controllers';
import { RequestValidatorMiddleware } from '../../../../../../core/middlewares';
import { ContainerInstanceTokens, MiddlewareIntanceTokens } from '../../../../../../core/helpers/enums';
import { authRequestSchema } from '../schemas';

const controller: AuthController = container.getInstance(ContainerInstanceTokens.AUTH_CONTROLLER_V1);
const requestValidatorMiddleware: RequestValidatorMiddleware = container.getInstance(MiddlewareIntanceTokens.REQUEST_VALIDATOR);

export default (router: Router): void => {
  router.post('/auth', [
    middlewareAdapter(requestValidatorMiddleware, authRequestSchema),
    routeAdapter(controller.auth),
  ]);
}
