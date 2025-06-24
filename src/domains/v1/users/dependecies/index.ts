import { container } from 'tsyringe';
import { ContainerInstanceTokens, UseCasesInstanceTokens } from '../../../../core/helpers/enums';
import { UserController } from '../controllers';
import { UserRepository } from '../repositories';
import { UserService } from '../services/user-service';
import { SignUp } from '../use-cases';

export const registerUserInstances = () => {
  container.registerSingleton<UserRepository>(ContainerInstanceTokens.USER_REPOSITORY_V1, UserRepository);
  container.registerSingleton<UserService>(ContainerInstanceTokens.USER_SERVICE_V1, UserService);
  container.registerSingleton<UserController>(ContainerInstanceTokens.USER_CONTROLLER_V1, UserController);
  container.registerSingleton<SignUp>(UseCasesInstanceTokens.SIGN_UP, SignUp);
}
