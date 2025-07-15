import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import configRoutes from "../routes/routes";
import logger from "./config/logger";
import { errorMiddleware } from "../core/middlewares";
import { Result } from "../core/protocols/repository";

interface Server {
  // register(method: string, url: string, callback: Function): void;
  register(setupRoutes: Function): void;
  registerMiddlewares(): void;
  startServer(port: number): void;
}

function normalizeBody(response: Result<any>) {
  const applicationResponse = { ...response };
  delete applicationResponse.__v;

  return applicationResponse;
}

class Application {
  private readonly server: express.Express = express();

  constructor() {
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupResource();
    this.setupErrorHandlers();
  }

  private setupMiddlewares() {
    this.server.use(cors());
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(async (request, response, next) => {
      if (!request.headers["content-type"]) {
        return next();
      }

      const allowedContentTypes = [
        "application/json",
        "application/x-www-form-urlencoded",
      ];

      if (!allowedContentTypes.includes(request.headers["content-type"])) {
        return response.status(415).json({
          message: "Unsupported Media Type",
          detail: "Unsupported Media Type. Please use application/json or application/x-www-form-urlencoded",
        });
      }

      next();
    });
  }

  private setupRoutes() {
    this.server.get("/", (_request: Request, response: Response) => {
      return response.status(200).json({ message: "Server online!" });
    });
    void configRoutes(this.server);
  }

  private setupErrorHandlers() {
    this.server.use(errorMiddleware);
  }

  public getServerInstance() {
    return this.server;
  }

  public setupResource() {
    this.server.use(
      (request: Request, response: Response, next: NextFunction) => {
        const originalMethod = response.json;
        response.json = function (body: any) {
          if (Array.isArray(body)) {
            return originalMethod.call(this, {
              data: body.map(normalizeBody),
            });
          } else {
            if (body.data && body.total && Array.isArray(body.data)) {
              return body;
            } else {
              return originalMethod.call(this, { data: normalizeBody(body) });
            }
          }
        };

        next();
      }
    );
  }

  public startServer(port: number) {
    this.server.listen(port, () => {
      logger.info(`API online on port: ${port}`);
    });
  }
}

export default Application;
