import { injectable, inject } from 'tsyringe';
import { Controller } from '../../../../../../core/base';
import { AuthService } from '../services';
import { ContainerInstanceTokens } from '../../../../../../core/helpers/enums';
import { HttpStatusCode } from '../../../../../../core/helpers/http';
import { AuthErrorMessages } from '../helpers/enums';

@injectable()
export class AuthController extends Controller {
  private readonly authService: AuthService;

  constructor(
    @inject(ContainerInstanceTokens.AUTH_SERVICE_V1) authService: AuthService,
  ) {
    super();
    this.authService = authService;
    this.auth = this.auth.bind(this);
  }

  public async auth(request: AuthController.AuthRequest) {
    try {
      const { email, password } = request;

      const accessToken = await this.authService.auth({ email, password });
      if (!accessToken) {
        return this.httpResponse(HttpStatusCode.BAD_REQUEST, { error: AuthErrorMessages.invalidCredentials });
      }

      return this.httpResponse(HttpStatusCode.OK, accessToken);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

declare namespace AuthController {
  type AuthRequest = {
    email: string;
    password: string;
  }
}
