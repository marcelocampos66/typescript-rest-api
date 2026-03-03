import { container } from '..';
import { ContainerInstanceTokens, UseCasesInstanceTokens } from '../../helpers/enums';
import { UserController } from '../../../domains/v1/users/controllers';
import { UserRepository } from '../../../domains/v1/users/repositories';
import { UserService } from '../../../domains/v1/users/services/user-service';
import { SignUp } from '../../../domains/v1/users/use-cases';
import { AuthController } from '../../../domains/v1/users/subdomains/auth/controllers';
import { AuthService } from '../../../domains/v1/users/subdomains/auth/services';

export const registerDomainModule = () => {
  // Users
  container.register<UserRepository>(ContainerInstanceTokens.USER_REPOSITORY_V1, UserRepository);
  container.register<UserService>(ContainerInstanceTokens.USER_SERVICE_V1, UserService);
  container.register<UserController>(ContainerInstanceTokens.USER_CONTROLLER_V1, UserController);
  container.register<SignUp>(UseCasesInstanceTokens.SIGN_UP, SignUp);

  // Auth
  container.register<AuthService>(ContainerInstanceTokens.AUTH_SERVICE_V1, AuthService);
  container.register<AuthController>(ContainerInstanceTokens.AUTH_CONTROLLER_V1, AuthController);
};
