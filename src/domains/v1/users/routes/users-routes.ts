import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../controllers';
import { routeAdapter } from '../../../../api/adapters';
import { authentication, joiMiddleware } from '../../../../common/middlewares';
import { userRegister, getUserById } from '../schemas';

const controller: UserController = container.resolve(UserController);

export default (router: Router): void => {
  router.post('/v1/users/sign-up', [
    joiMiddleware(userRegister),
    routeAdapter(controller.registerUser),
  ]);
  router.get('/v1/users', [
    authentication,
    routeAdapter(controller.getAllUsers),
  ]);
  router.get('/v1/users/:userId', [
    authentication,
    joiMiddleware(getUserById),
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
