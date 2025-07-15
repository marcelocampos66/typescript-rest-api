import { Router } from 'express';
import { container } from 'tsyringe';
import { routeAdapter, middlewareAdapter } from '../../../../../../application/adapters';
import { AuthController } from '../controllers';
import { RequestValidatorMiddleware } from '../../../../../../core/middlewares';
import { MiddlewareIntanceTokens } from '../../../../../../core/helpers/enums';
import { authRequestSchema } from '../schemas';

const controller: AuthController = container.resolve(AuthController);
const requestValidatorMiddleware: RequestValidatorMiddleware = container.resolve(MiddlewareIntanceTokens.REQUEST_VALIDATOR);

export default (router: Router): void => {
  router.post('/auth', [
    middlewareAdapter(requestValidatorMiddleware, authRequestSchema),
    routeAdapter(controller.auth),
  ]);
}
