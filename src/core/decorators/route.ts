import 'reflect-metadata';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head';

export interface RouteDefinition {
  httpMethod: HttpMethod;
  path: string;
  propertyKey: string | symbol;
}

export const ROUTES_METADATA_KEY = Symbol('routes');

const createRouteDecorator = (httpMethod: HttpMethod) =>
  (path: string): MethodDecorator =>
    (target: Object, propertyKey: string | symbol): void => {
      const routes: RouteDefinition[] = Reflect.getMetadata(ROUTES_METADATA_KEY, target.constructor) || [];
      routes.push({ httpMethod, path, propertyKey });
      Reflect.defineMetadata(ROUTES_METADATA_KEY, routes, target.constructor);
    };

export const Get = createRouteDecorator('get');
export const Post = createRouteDecorator('post');
export const Put = createRouteDecorator('put');
export const Patch = createRouteDecorator('patch');
export const Delete = createRouteDecorator('delete');
export const Head = createRouteDecorator('head');
