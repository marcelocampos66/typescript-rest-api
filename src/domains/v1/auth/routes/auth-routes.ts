import { Router } from 'express';
import { container } from 'tsyringe';
import { routeAdapter } from '../../../../api/adapters';
import { AuthController } from '../controllers';

const controller: AuthController = container.resolve(AuthController);

export default (router: Router): void => {
  router.post('/v1/auth/login', [
    routeAdapter(controller.authenticate),
  ]);
}
