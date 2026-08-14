import { Router, RouteHandler } from '../protocols';
import { ROUTES_METADATA_KEY, RouteDefinition } from '../decorators';

export abstract class Routes {
  public register(router: Router): void {
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_METADATA_KEY, this.constructor) || [];

    routes.forEach(({ httpMethod, path, propertyKey }) => {
      const handlers = (this as unknown as Record<string | symbol, () => RouteHandler[]>)[propertyKey]();
      router[httpMethod](path, handlers);
    });
  }
}
