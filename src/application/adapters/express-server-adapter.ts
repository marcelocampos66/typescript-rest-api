import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import logger from '../config/logger';
import { errorMiddleware } from '../../core/middlewares';
import { middlewareAdapter } from '../adapters';
import { HttpServer, Middleware } from '../../core/protocols';

interface Link {
  href: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

interface Links {
  self?: Link;
  update?: Link;
  delete?: Link;
  [key: string]: Link | undefined; // Permite links adicionais
}

interface Meta {
  _links?: Links;
  _pagination?: {
    total: number;
    page: number;
    limit: number;
  };
  [key: string]: any; // Permite outros metadados adicionais
}

interface FinalFormattedResponse<T> {
  data: T | T[];
  _meta?: Meta; // _meta pode ser opcional se não houver metadados
  [key: string]: any; // Permite outras propriedades no nível raiz, se necessário
}

export class ExpressServerAdapter implements HttpServer {
  private readonly server: express.Express = express();

  constructor() {
    this.setupDefaultAppMiddlewares();
    this.setupResource();
    this.setupErrorHandlers();
  }

  private setupDefaultAppMiddlewares() {
    this.server.use(cors());
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(async (request, _response, next) => {
      logger.info(`REQUEST - [${new Date().toISOString()}] ${request.method} ${request.url}`);

      next();
    });
    this.server.use(async (request, response, next) => {
      response.on("finish", () => {
        logger.info(
          `RESPONSE - [${new Date().toISOString()}] ${request.method} ${request.url} ${response.statusCode} ${response.statusMessage}`
        );
        logger.info(`HEADERS - ${response.getHeaders()}`);
      });
      
      next();
    });
  }

  public setupMiddlewares(Middlewares: (new () => Middleware)[]) {
    for (const AppMiddleware of Middlewares) {
      const middleware = new AppMiddleware();
      this.server.use(middlewareAdapter(middleware));
    }
  }

  public setupRoutes(setupMethod: Function) {
    this.server.get("/", (_request: Request, response: Response) => {
      return response.status(200).json({ message: "Server online!" });
    });
    void setupMethod(this.server);
  }

  private setupErrorHandlers() {
    this.server.use(errorMiddleware);
  }

  public getServerInstance() {
    return this.server;
  }

  private setupResource() {
    this.server.use(
      (request: Request, response: Response, next: NextFunction) => {
        const originalJson = response.json;

        response.json = function (body: any) {
          let finalResponse: FinalFormattedResponse<any>;
          let dataToProcess: any;
          let metaToProcess: Meta = {};

          // Função auxiliar para remover '__v'
          const cleanObject = (input: any) => {
            if (!input || typeof input !== "object") {
              return input; // Retorna o valor original se não for um objeto
            }
            let cleaned = { ...input };
            if ("__v" in cleaned) {
              delete cleaned.__v;
              return cleaned;
            }

            return cleaned;
          };
          //

          if (Array.isArray(body)) {
            finalResponse = {
              data: body.map(cleanObject),
            };

            return originalJson.call(this, finalResponse);
          }
          
          if (body.data && Array.isArray(body.data)) {
            finalResponse = {
              data: body.data.map(cleanObject),
            }
          } else {
            finalResponse = {
              data: cleanObject(body),
            }
          }
          
          if ("_meta" in body) {
            finalResponse._meta = {
              ...body._meta,
            };
          }

          if (
            "data" in body &&
            Array.isArray(body.data) &&
            "_pagination" in body
          ) {
            finalResponse._meta = {
              ...(body._meta || {}),
              _pagination: {
                ...body._pagination,
              },
            };
          }

          return originalJson.call(this, finalResponse);
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
