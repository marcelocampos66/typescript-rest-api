import { registerCryptographyInstances, registerBrokerInstances } from '../../infra/dependecies';
import { registerMiddlewareInstances } from '../middlewares/dependecies';
import { registerUserInstances } from '../../domains/v1/users/dependecies';
import { registerAuthInstances } from '../../domains/v1/users/subdomains/auth/dependecies';

const dependecyInjectionContainerRegisters = [
  registerCryptographyInstances,
  registerMiddlewareInstances,
  registerUserInstances,
  registerAuthInstances,
  registerBrokerInstances,
]

for (const registerMethod of dependecyInjectionContainerRegisters) {
  registerMethod();
}
