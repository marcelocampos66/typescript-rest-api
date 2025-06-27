import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../controllers';
import { routeAdapter } from '../../../../application/adapters';
import { authMiddleware, requestValidatorMiddleware } from '../../../../core/middlewares';
import { getUserByIdRequestSchema, userRegisterRequestSchema, userUpdateRequestSchema } from '../schemas';
import { ContainerInstanceTokens } from '../../../../core/helpers/enums';
import { ClientProviders } from "../../../../data/protocols/database";

const controller: UserController = container.resolve(ContainerInstanceTokens.USER_CONTROLLER_V1);

export default (router: Router): void => {
  router.post('/users/sign-up', [
    requestValidatorMiddleware(userRegisterRequestSchema),
    routeAdapter(controller.signup),
  ]);
  router.post('/users', [
    authMiddleware,
    requestValidatorMiddleware(userRegisterRequestSchema),
    routeAdapter(controller.createUser, { transactional: true, clientProvider: ClientProviders.MONGODB }),
  ]);
  router.get('/users', [
    authMiddleware,
    routeAdapter(controller.listUsers),
  ]);
  router.get('/users/:userId', [
    authMiddleware,
    requestValidatorMiddleware(getUserByIdRequestSchema),
    routeAdapter(controller.findUserById),
  ]);
  router.put('/users/profile', [
    authMiddleware,
    requestValidatorMiddleware(userUpdateRequestSchema),
    routeAdapter(controller.updateProfile),
  ]);
}
