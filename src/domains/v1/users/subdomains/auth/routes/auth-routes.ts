import { RouteHandler } from '../../../../../../core/protocols';
import { injectable, inject } from '../../../../../../core/dependency-injection';
import { expressRouteAdapter, expressMiddlewareAdapter } from '../../../../../../application/adapters';
import { AuthController } from '../controllers';
import { RequestValidatorMiddleware } from '../../../../../../core/middlewares';
import { Routes } from '../../../../../../core/base';
import { Post } from '../../../../../../core/decorators';
import { ContainerInstanceTokens, MiddlewareInstanceTokens } from '../../../../../../core/dependency-injection/tokens';
import { authRequestValidator } from '../validators';

@injectable()
export class AuthRoutes extends Routes {
  constructor(
    @inject(ContainerInstanceTokens.AUTH_CONTROLLER_V1) private readonly controller: AuthController,
    @inject(MiddlewareInstanceTokens.REQUEST_VALIDATOR) private readonly requestValidatorMiddleware: RequestValidatorMiddleware,
  ) {
    super();
  }

  @Post('/auth')
  public auth(): RouteHandler[] {
    return [
      expressMiddlewareAdapter(this.requestValidatorMiddleware, authRequestValidator),
      expressRouteAdapter(this.controller.auth),
    ];
  }
}

export default AuthRoutes;
