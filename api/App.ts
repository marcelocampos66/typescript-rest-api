import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import errorMiddleware from '../middlewares/errorMiddleware';

type port = string | undefined;

class App {
  public app: express.Application;
  public port: port;
  private routes: IRoutes;

  constructor(port: port, routes: IRoutes) {
    this.app = express();
    this.routes = routes;
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
    this.app.use('/users', this.routes.users.router);
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
