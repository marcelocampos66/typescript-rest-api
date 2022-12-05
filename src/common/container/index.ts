import { container } from 'tsyringe';
import { UserController } from '../../domains/v1/users/controllers';
import { UserService } from '../../domains/v1/users/services';
import { UserRepository } from '../../domains/v1/users/repositories';
import { AuthController } from '../../domains/v1/auth/controllers';
import { AuthService } from '../../domains/v1/auth/services';

container.registerSingleton<UserRepository>('UserRepository', UserRepository);
container.registerSingleton<UserService>('UserService', UserService);
container.registerSingleton<UserController>('UserController', UserController);

container.registerSingleton<AuthService>('AuthService', AuthService);
container.registerSingleton<AuthController>('AuthController', AuthController);
