import express, { Request, Response, NextFunction } from 'express';
import services from '../services/services';
import Middlewares from '../middlewares/Middlewares';

class UserController extends Middlewares {
  public router: express.Router;
  private userService = services.users;
  constructor() {
    super();
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', [
      this.validateJWT,
      this.getAllUsers,
    ]);
    this.router.get('/:id', [
      this.validateJWT,
      this.getUserById,
    ]);
    this.router.post('/', [
      this.verifyUserData,
      this.verifyUserExists,
      this.registerUser,
    ]);
    this.router.put('/update/self-user', [
      this.validateJWT,
      this.verifyUserData,
      this.updateUser,
    ]);
    this.router.delete('/:id', this.deleteUser);
    this.router.post('/login', this.login);
  }

  private getAllUsers = async (
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.userService.getAllUsers();
    return res.status(200).json(result);
  }

  private getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { params: { id } } = req;
    const result = await this.userService.getUserById(id);
    if (result.error) {
      return next({ status: 404, message: result.error.message });
    }
    return res.status(200).json(result);
  }
  
  private registerUser = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const { body } = req;
    const result = await this.userService.registerUser(body);
    return res.status(201).json(result);
  }

  private updateUser = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const { body } = req;
    const user = this.payload as IPayload;
    const result = await this.userService.updateUser(user.id, body);
    return res.status(200).json(result);
  }

  private deleteUser = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const { params: { id } } = req;
    const result = await this.userService.deleteUser(id);
    return res.status(200).json(result);
  }

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { body: { email, password } } = req;
    const result = await this.userService.login(email, password);
    if (result.error) {
      return next({ status: 404, message: result.error.message });
    }
    return res.status(200).json(result)
  }

}

export default UserController;
