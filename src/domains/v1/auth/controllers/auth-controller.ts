import { injectable, inject } from 'tsyringe';
import { Controller } from '../../../../common/base';
import { AuthService } from '../services';
import { HttpStatusCode, AuthErrorMessages } from '../../../../common/helpers/enum-helper';

@injectable()
export class AuthController extends Controller {
  private readonly authService: AuthService;

  constructor(
    @inject('AuthService') authService: AuthService,
  ) {
    super();
    this.authService = authService;
    this.authenticate = this.authenticate.bind(this);
  }

  public async authenticate(request: AuthController.AuthRequest) {
    try {
      const { email, password } = request;

      const token = await this.authService.authenticate({ email, password });
      if (!token) {
        return this.httpResponse(HttpStatusCode.BAD_REQUEST, { error: AuthErrorMessages.invalidCredentials });
      }

      return this.httpResponse(HttpStatusCode.OK, token);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

declare namespace AuthController {
  export interface AuthRequest {
    email: string;
    password: string;
  }
}
