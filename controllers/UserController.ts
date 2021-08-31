import express, { Request, Response, NextFunction } from 'express';
import services from '../services/services';
import middlewares from '../middlewares';

class UserController {
  public router: express.Router;
  private userService = services.users;
  private middlewares = middlewares;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.getAllUsers);
    this.router.get('/:id', this.getUserById);
    this.router.post('/', [
      this.middlewares.verifyUserData,
      this.registerUser,
    ]);
    this.router.put('/:id', [
      this.middlewares.verifyUserData,
      this.updateUser,
    ]);
    this.router.delete('/:id', this.deleteUser);
  }

  private getAllUsers = async (_req: Request, res: Response, _next: NextFunction) => {
    const result = await this.userService.getAllUsers();
    return res.status(200).json(result);
  }

  private getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { params: { id } } = req;
    const result = await this.userService.getUserById(id);
    if (result.error) {
      result.error.status = 404;
      return next(result.error);
    }
    return res.status(200).json(result);
  }
  
  private registerUser = async (req: Request, res: Response, _next: NextFunction) => {
    const { body } = req;
    const result = await this.userService.registerUser(body);
    return res.status(201).json(result);
  }

  private updateUser = async (req: Request, res: Response, _next: NextFunction) => {
    const { body, params: { id } } = req;
    const result = await this.userService.updateUser(id, body);
    return res.status(200).json(result);
  }

  private deleteUser = async (req: Request, res: Response, _next: NextFunction) => {
    const { params: { id } } = req;
    const result = await this.userService.deleteUser(id);
    return res.status(200).json(result);
  }

}

export default UserController;
