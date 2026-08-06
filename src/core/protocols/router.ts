export type RouteHandler = (...args: any[]) => any;

export interface Router {
  get(path: string, handlers: RouteHandler[]): void;
  post(path: string, handlers: RouteHandler[]): void;
  put(path: string, handlers: RouteHandler[]): void;
  patch(path: string, handlers: RouteHandler[]): void;
  delete(path: string, handlers: RouteHandler[]): void;
  head(path: string, handlers: RouteHandler[]): void;
}
