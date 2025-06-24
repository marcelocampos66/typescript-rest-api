import { Request, Response } from 'express';
import { HttpResponse, Controller } from '../../core/protocols';
import contextStorage from '../../core/context/context-storage';
import { AppTransactionHandler } from "../../infra/database/transaction-handler";
import { ClientProviders } from '../../data/protocols/database';
import { BadRequestError } from "../../core/errors";

type Options = {
  transactional?: boolean;
  clientProvider?: ClientProviders;
}

export const routeAdapter = (controller: Controller, options?: Options) => {
  return async (request: Request, response: Response) => {
    const httpRequest = {
      auth: request.auth ? request.auth : {},
      path: request.path,
      ...request.body,
      ...request.params,
      ...request.query,
    };

    if (options?.transactional) {
      if (!options.clientProvider) {
        throw new BadRequestError('Missing client provider');
      }

      const transactionHandler = new AppTransactionHandler(options.clientProvider);
      try {
        await transactionHandler.startTransaction(async () => {
          const session = transactionHandler.getTransactionSession();
          await contextStorage.store({
            ...(session && { session }),
            audit: { user: httpRequest.auth ? httpRequest.auth.id : null } },
            async () => {
              const httpResponse: HttpResponse = await controller(httpRequest);
              if (httpResponse.statusCode >= 400) {
                await transactionHandler.endTransaction();
              }

              response.status(httpResponse.statusCode).json(httpResponse.body);
            }
          );
        });

        return;
      } catch (error) {
        throw error;
      } finally {
        await transactionHandler.endTransaction();
      }
    } else {
      try {
        await contextStorage.store({ audit: { user: httpRequest.auth ? httpRequest.auth.id : null } }, async () => {
          const httpResponse: HttpResponse = await controller(httpRequest);

          response.status(httpResponse.statusCode).json(httpResponse.body);
        });
        return;
      } catch (error) {
        throw error;
      }
    }
  };
};
