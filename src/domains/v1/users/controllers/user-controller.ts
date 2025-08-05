import { injectable, inject } from 'tsyringe';
import { Controller } from '../../../../core/base';
import { UserService } from '../services';
import { ContainerInstanceTokens, UseCasesInstanceTokens } from '../../../../core/helpers/enums';
import { HttpStatusCode } from '../../../../core/helpers/http';
import { UsersErrorMessages } from '../helpers/enums';
import { SignUp } from '../use-cases';

@injectable()
export class UserController extends Controller {
  private readonly userService: UserService;
  private readonly singUp: SignUp;

  constructor(
    @inject(ContainerInstanceTokens.USER_SERVICE_V1) userService: UserService,
    @inject(UseCasesInstanceTokens.SIGN_UP) singUp: SignUp,
  ) {
    super();
    this.userService = userService;
    this.singUp = singUp;
    this.signup = this.signup.bind(this);
    this.createUser = this.createUser.bind(this);
    this.findUserById = this.findUserById.bind(this);
    this.listUsers = this.listUsers.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  public async signup(request: UserController.CreateUserRequest) {
    try {
      const user = await this.singUp.execute(request);

      return this.httpResponse(HttpStatusCode.CREATED, user);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async createUser(request: UserController.CreateUserRequest) {
    try {
      const { name, email, password }  = request;
      const user = await this.userService.createUser({ name, email, password });

      return this.httpResponse(HttpStatusCode.CREATED, user);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async listUsers(request: { page: number; size: number }) {
    try {
      const users = await this.userService.paginate({
        page: request.page,
        size: request.size,
      });

      return this.httpResponse(HttpStatusCode.OK, users);
    } catch (error) {
      return this.handleError(error);
    }
  }
 
  public async findUserById(request: UserController.FindUserByIdRequest) {
    try {
      const { userId } = request;
      const user = await this.userService.findById(userId);
      if (!user) {
        return this.httpResponse(HttpStatusCode.NOT_FOUND, { message: UsersErrorMessages.notFound })
      }
      
      return this.httpResponse(HttpStatusCode.OK, user);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  public async updateProfile(request: UserController.UpdateUserRequest) {
    try {
      const { auth, name, email, password } = request;
      await this.userService.updateProfile(auth.id, { name, email, password });

      return this.httpResponse(HttpStatusCode.NO_CONTENT, null);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

declare namespace UserController {
  export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }

  export interface FindUserByIdRequest {
    userId: string;
  }

  export interface UpdateUserRequest {
    auth: Payload;
    name: string;
    email: string;
    password: string;
  }
}
