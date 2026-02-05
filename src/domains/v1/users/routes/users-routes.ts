import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../controllers';
import { routeAdapter, middlewareAdapter } from '../../../../application/adapters';
import { AuthMiddleware, RequestValidatorMiddleware } from '../../../../core/middlewares';
import { getUserByIdRequestSchema, userRegisterRequestSchema, userUpdateRequestSchema, getUsersRequestSchema } from '../schemas';
import { ContainerInstanceTokens, MiddlewareIntanceTokens } from '../../../../core/helpers/enums';
import { ClientProviders } from "../../../../data/protocols/database";

const controller: UserController = container.resolve(ContainerInstanceTokens.USER_CONTROLLER_V1);
const authMiddleware: AuthMiddleware = container.resolve(MiddlewareIntanceTokens.AUTH);
const requestValidatorMiddleware: RequestValidatorMiddleware = container.resolve(MiddlewareIntanceTokens.REQUEST_VALIDATOR);

export default (router: Router): void => {
  router.post('/users/sign-up', [
    middlewareAdapter(requestValidatorMiddleware, userRegisterRequestSchema),
    routeAdapter(controller.signup),
  ]);
  router.post('/users', [
    middlewareAdapter(authMiddleware),
    middlewareAdapter(requestValidatorMiddleware, userRegisterRequestSchema),
    routeAdapter(controller.createUser, { transactional: true, clientProvider: ClientProviders.MONGODB }),
  ]);
  router.get('/users', [
    middlewareAdapter(authMiddleware),
    middlewareAdapter(requestValidatorMiddleware, getUsersRequestSchema),
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
    middlewareAdapter(requestValidatorMiddleware, getUserByIdRequestSchema),
    routeAdapter(controller.findUserById),
  ]);
  router.put('/users/profile', [
    middlewareAdapter(authMiddleware),
    middlewareAdapter(requestValidatorMiddleware, userUpdateRequestSchema),
    routeAdapter(controller.updateProfile),
  ]);
}
