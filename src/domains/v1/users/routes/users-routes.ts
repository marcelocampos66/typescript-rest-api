import { Router } from 'express';
import { container } from '../../../../core/dependency-injection';
import { UserController } from '../controllers';
import { routeAdapter, middlewareAdapter } from '../../../../application/adapters';
import { AuthMiddleware, RequestValidatorMiddleware } from '../../../../core/middlewares';
import {
  getUserByIdRequestValidator,
  userRegisterRequestValidator,
  userUpdateRequestValidator,
  getUsersRequestValidator
} from '../validators';
import { ContainerInstanceTokens, MiddlewareIntanceTokens } from '../../../../core/dependency-injection/tokens';
import { ClientProviders } from "../../../../data/protocols/database";

const controller: UserController = container.getInstance(ContainerInstanceTokens.USER_CONTROLLER_V1);
const authMiddleware: AuthMiddleware = container.getInstance(MiddlewareIntanceTokens.AUTH);
const requestValidatorMiddleware: RequestValidatorMiddleware = container.getInstance(MiddlewareIntanceTokens.REQUEST_VALIDATOR);

export default (router: Router): void => {
  router.post('/users/sign-up', [
    middlewareAdapter(requestValidatorMiddleware, userRegisterRequestValidator),
    routeAdapter(controller.signup),
  ]);
  router.post('/users', [
    middlewareAdapter(authMiddleware),
    middlewareAdapter(requestValidatorMiddleware, userRegisterRequestValidator),
    routeAdapter(controller.createUser, { transactional: true, clientProvider: ClientProviders.MONGODB }),
  ]);
  router.get('/users', [
    middlewareAdapter(authMiddleware),
    middlewareAdapter(requestValidatorMiddleware, getUsersRequestValidator),
    routeAdapter(controller.listUsers, {
      cache: {
        maxAge: 60,
        type: 'public',
        revalidate: 'no-revalidate'
      }
    }),
  ]);
  router.get('/users/:userId', [
    middlewareAdapter(authMiddleware),
    middlewareAdapter(requestValidatorMiddleware, getUserByIdRequestValidator),
    routeAdapter(controller.findUserById),
  ]);
  router.put('/users/profile', [
    middlewareAdapter(authMiddleware),
    middlewareAdapter(requestValidatorMiddleware, userUpdateRequestValidator),
    routeAdapter(controller.updateProfile),
  ]);
}
