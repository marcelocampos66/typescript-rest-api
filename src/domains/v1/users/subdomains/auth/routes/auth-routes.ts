import { Router } from 'express';
import { container } from 'tsyringe';
import { routeAdapter } from '../../../../../../application/adapters';
import { AuthController } from '../controllers';
import { requestValidatorMiddleware } from '../../../../../../core/middlewares';
import { authRequestSchema } from '../schemas';

const controller: AuthController = container.resolve(AuthController);

export default (router: Router): void => {
  router.post('/auth', [
    requestValidatorMiddleware(authRequestSchema),
    routeAdapter(controller.auth),
  ]);
}
