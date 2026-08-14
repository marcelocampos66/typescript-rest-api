import { RouteHandler } from '../../../../core/protocols';
import { injectable, inject } from '../../../../core/dependency-injection';
import { UserController } from '../controllers';
import { expressRouteAdapter, expressMiddlewareAdapter } from '../../../../application/adapters';
import { AuthMiddleware, RequestValidatorMiddleware } from '../../../../core/middlewares';
import { Routes } from '../../../../core/base';
import { Get, Post, Put } from '../../../../core/decorators';
import {
  getUserByIdRequestValidator,
  userRegisterRequestValidator,
  userUpdateRequestValidator,
  getUsersRequestValidator
} from '../validators';
import { ContainerInstanceTokens, MiddlewareInstanceTokens } from '../../../../core/dependency-injection/tokens';
import { ClientProviders } from "../../../../data/protocols/database";

@injectable()
export class UsersRoutes extends Routes {
  constructor(
    @inject(ContainerInstanceTokens.USER_CONTROLLER_V1) private readonly controller: UserController,
    @inject(MiddlewareInstanceTokens.AUTH) private readonly authMiddleware: AuthMiddleware,
    @inject(MiddlewareInstanceTokens.REQUEST_VALIDATOR) private readonly requestValidatorMiddleware: RequestValidatorMiddleware,
  ) {
    super();
  }

  @Post('/users/sign-up')
  public signUp(): RouteHandler[] {
    return [
      expressMiddlewareAdapter(this.requestValidatorMiddleware, userRegisterRequestValidator),
      expressRouteAdapter(this.controller.signup),
    ];
  }

  @Post('/users')
  public createUser(): RouteHandler[] {
    return [
      expressMiddlewareAdapter(this.authMiddleware),
      expressMiddlewareAdapter(this.requestValidatorMiddleware, userRegisterRequestValidator),
      expressRouteAdapter(this.controller.createUser, { transactional: true, clientProvider: ClientProviders.MONGODB }),
    ];
  }

  @Get('/users')
  public listUsers(): RouteHandler[] {
    return [
      expressMiddlewareAdapter(this.authMiddleware),
      expressMiddlewareAdapter(this.requestValidatorMiddleware, getUsersRequestValidator),
      expressRouteAdapter(this.controller.listUsers, {
        cache: {
          maxAge: 60,
          type: 'public',
          revalidate: 'no-revalidate'
        }
      }),
    ];
  }

  @Get('/users/:userId')
  public findUserById(): RouteHandler[] {
    return [
      expressMiddlewareAdapter(this.authMiddleware),
      expressMiddlewareAdapter(this.requestValidatorMiddleware, getUserByIdRequestValidator),
      expressRouteAdapter(this.controller.findUserById),
    ];
  }

  @Put('/users/profile')
  public updateProfile(): RouteHandler[] {
    return [
      expressMiddlewareAdapter(this.authMiddleware),
      expressMiddlewareAdapter(this.requestValidatorMiddleware, userUpdateRequestValidator),
      expressRouteAdapter(this.controller.updateProfile),
    ];
  }
}

export default UsersRoutes;
