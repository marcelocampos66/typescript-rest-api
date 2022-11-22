import { NextFunction, Request, Response, Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from './controllers';
import joiMiddleware from '../../../common/middlewares/joi-middleware';
import { userRegister } from './schemas';

const controller: UserController = container.resolve(UserController);

export default (router: Router): void => {
  router.get('/v1/health-check', [
    controller.healthCheck,
  ]);
  router.post('/v1/create-user', [
    joiMiddleware(userRegister),
    controller.registerUser,
  ]);
}
