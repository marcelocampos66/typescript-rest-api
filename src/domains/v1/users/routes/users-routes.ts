import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../controllers';
import { routeAdapter } from '../../../../api/adapters';
import { authentication, joiMiddleware } from '../../../../common/middlewares';
import { joiUserRegister, joiGetUserById } from '../schemas';

const controller: UserController = container.resolve(UserController);

export default (router: Router): void => {
  router.post('/v1/users/sign-up', [
    joiMiddleware(joiUserRegister),
    routeAdapter(controller.registerUser),
  ]);
  router.get('/v1/users', [
    authentication,
    routeAdapter(controller.getAllUsers),
  ]);
  router.get('/v1/users/:userId', [
    authentication,
    joiMiddleware(joiGetUserById),
    routeAdapter(controller.getUserById),
  ]);
  router.put('/v1/users', [
    authentication,
    routeAdapter(controller.updateUser),
  ]);
  router.delete('/v1/users', [
    authentication,
    routeAdapter(controller.deleteUser),
  ]);
}
