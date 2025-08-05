import { Middleware } from './middleware';

export interface HttpServer {
  setupRoutes(setupMethod: Function): void;
  setupMiddlewares(Middlewares: (new () => Middleware)[]): void;
  startServer(port: number): void;
}
