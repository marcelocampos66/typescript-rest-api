import { Middleware } from './middleware';

export interface HttpServer {
  setupRoutes(setupMethod: Function): Promise<void>;
  setupMiddlewares(Middlewares: (new () => Middleware)[]): void;
  startServer(port: number): void;
}
