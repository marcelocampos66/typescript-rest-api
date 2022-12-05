import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import setupRoutes from '../routes/routes';
import errorMiddleware from '../common/middlewares/error-middleware';

class App {
  public app: Express;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initialMiddlewares();
    this.callRoutes();
    this.handleErrors();
  }

  private initialMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private callRoutes() {
    this.app.get('/', (_req: Request, res: Response) => {
      return res.status(200).json({ message: 'Server online!' });
    })
    setupRoutes(this.app);
  }

  private handleErrors() {
    this.app.use(errorMiddleware);
  }

  public startServer() {
    this.app.listen(this.port, () => {
      console.log(`API online na porta: ${this.port}`);
    })
  }
}

export default App;
