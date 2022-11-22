import { container } from 'tsyringe';
import { UserController } from '../../domains/v1/users/controllers';
import { UserService } from '../../domains/v1/users/services';
import { UserRepository } from '../../domains/v1/users/repositories';

container.registerSingleton<UserController>('UserController', UserController);
container.registerSingleton<UserService>('UserService', UserService);
container.registerSingleton<UserRepository>('UserRepository', UserRepository);
