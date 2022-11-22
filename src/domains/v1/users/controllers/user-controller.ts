import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { UserService } from '../services';

@injectable()
export class UserController {
  private readonly userService: UserService;

  constructor(
    @inject('UserService') userService: UserService,
  ) {
    this.userService = userService;
  }

  public async healthCheck(
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    return res.status(200).json({ message: 'Server online!' });
  }

  // public async getAllUsers(
  //   _req: Request,
  //   res: Response,
  //   _next: NextFunction
  // ) {
  //   const result = await this.userService.getAllUsers();
  //   return res.status(200).json(result);
  // }
 
  // public async getUserById(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   const { params: { id } } = req;
  //   const result = await this.userService.getUserById(id);
  //   if (result.error) {
  //     return next({ status: 404, message: result.error.message });
  //   }
  //   return res.status(200).json(result);
  // }
  
  public registerUser = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const { body: { name, email, birthdate, password } } = req;
    const result = await this.userService.registerUser({ name, email, birthdate, password });

    return res.status(201).json({ result });
  }

  // public async updateUser(
  //   req: Request,
  //   res: Response,
  //   _next: NextFunction
  // ) {
  //   const { body } = req;
  //   const user = this.payload as IPayload;
  //   const result = await this.userService.updateUser(user.id, body);
  //   return res.status(200).json(result);
  // }

  // public async deleteUser(
  //   req: Request,
  //   res: Response,
  //   _next: NextFunction
  // ) {
  //   const { params: { id } } = req;
  //   const result = await this.userService.deleteUser(id);
  //   return res.status(200).json(result);
  // }

  // public async login(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   const { body: { email, password } } = req;
  //   const result = await this.userService.login(email, password);
  //   if (result.error) {
  //     return next({ status: 404, message: result.error.message });
  //   }
  //   return res.status(200).json(result)
  // }
}
