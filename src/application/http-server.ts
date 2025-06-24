import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import configRoutes from '../routes/routes';
import logger from './config/logger';
import { errorMiddleware } from '../core/middlewares';


class HttpServer {
  private readonly server: express.Express = express();

  constructor() {
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  private setupMiddlewares() {
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));
  }

  private setupRoutes() {
    this.server.get('/', (_request: Request, response: Response) => {
      return response.status(200).json({ message: 'Server online!' });
    })
    void configRoutes(this.server);
  }

  private setupErrorHandlers() {
    this.server.use(errorMiddleware);
  }

  public getServerInstance() {
    return this.server;
  }

  public startHttpServer(port: number) {
    this.server.listen(port, () => {
      logger.info(`API online on port: ${port}`);
    })
  }
}

export default HttpServer;
