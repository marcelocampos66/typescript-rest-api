import { injectable, inject } from 'tsyringe';
import { Controller } from '../../../../common/base';
import { UserService } from '../services';
import { HttpStatusCode, UsersErrorMessages } from '../../../../common/helpers/enum-helper';

@injectable()
export class UserController extends Controller {
  private readonly userService: UserService;

  constructor(
    @inject('UserService') userService: UserService,
  ) {
    super();
    this.userService = userService;
    this.registerUser = this.registerUser.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  public async registerUser(request: UserController.CreateUserRequest) {
    try {
      const { name, email, birthdate, password }  = request;
      const user = await this.userService.registerUser({ name, email, birthdate, password });
      if (!user) {
        return this.httpResponse(HttpStatusCode.CONFLICT, { error: UsersErrorMessages.emailAlreadyRegistered })
      }
      const { userId } = user;

      return this.httpResponse(HttpStatusCode.CREATED, { userId });
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async getAllUsers(_request: unknown) {
    try {
      const users = await this.userService.getAllUsers();
    
      return  this.httpResponse(HttpStatusCode.OK, users);
    } catch (error) {
      return this.handleError(error);
    }
  }
 
  public async getUserById(request: UserController.GetUserByIdRequest) {
    try {
      const { userId } = request;
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return this.httpResponse(HttpStatusCode.NOT_FOUND, { error: UsersErrorMessages.notFound })
      }
      
      return this.httpResponse(HttpStatusCode.OK, user);
    } catch (error) {
      return this.handleError(error);
    }
  }
  
  public async updateUser(request: UserController.UpdateUserRequest) {
    try {
      const { payload, name, email, birthdate, password } = request;
      await this.userService.updateUser(payload.id, { name, email, birthdate, password });

      return this.httpResponse(HttpStatusCode.NO_CONTENT, null);
    } catch (error) {
      return this.handleError(error);
    }
  }

  public async deleteUser(request: UserController.DeleteUserRequest) {
    try {
      const { payload: { id: userId } } = request;
      await this.userService.deleteUser(userId);
      
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
    birthdate: string;
    password: string;
  }

  export interface GetUserByIdRequest {
    userId: string;
  }

  export interface UpdateUserRequest {
    payload: Payload;
    name: string;
    email: string;
    birthdate: string;
    password: string;
  }

  export interface DeleteUserRequest {
    payload: Payload;
  }
}
