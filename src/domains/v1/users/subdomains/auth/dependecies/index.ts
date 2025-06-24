import { container } from 'tsyringe';
import { ContainerInstanceTokens } from '../../../../../../core/helpers/enums';
import { AuthController } from '../controllers';
import { AuthService } from '../services';

export const registerAuthInstances = () => {
  container.registerSingleton<AuthService>(ContainerInstanceTokens.AUTH_SERVICE_V1, AuthService);
  container.registerSingleton<AuthController>(ContainerInstanceTokens.AUTH_CONTROLLER_V1, AuthController);
}
