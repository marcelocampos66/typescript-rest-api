import { Request, Response } from 'express';
import crypto from 'node:crypto';
import { HttpResponse, Controller } from '../../core/protocols';
import contextStorage from '../../core/context/context-storage';
import { AppTransactionHandler } from "../../infra/database/transaction-handler";
import { ClientProviders } from '../../data/protocols/database';
import { BadRequestError } from "../../core/errors";

export type CacheOptions = {
  maxAge: number;
  type: 'public' | 'private';
  noCacheType?: 'no-store' | 'no-cache' | 'both';
  revalidate?: "must-revalidate" | "proxy-revalidate" | "no-revalidate";
}

type Options = {
  transactional?: boolean;
  clientProvider?: ClientProviders;
  cache?: CacheOptions;
}

function setCacheHeaders(response: Response, body: any, options: CacheOptions): boolean {
  const {
    maxAge,
    type,
    revalidate = 'no-revalidate',
  } = options;

  const bodyRaw = typeof body === 'object' ? JSON.stringify(body) : body;

  if (bodyRaw) {
    const hash = crypto.createHash('sha256').update(bodyRaw).digest('base64');

    if (response.req.headers['if-none-match'] === hash) {
      response.status(304).end(); // Not Modified
      return true;
    }

    response.setHeader('ETag', hash);
  }

  const revalidateFlag =
    revalidate === 'no-revalidate' ? '' : `, ${revalidate}`;

  let noCacheFlag = '';

  switch (options.noCacheType) {
    case 'no-store':
      noCacheFlag = ', no-store';
      break;
    case 'no-cache':
      noCacheFlag = ', no-cache';
      break;
    case 'both':
      noCacheFlag = ', no-store, no-cache';
      break;
  }

  response.setHeader(
    'Cache-Control',
    `${type}, max-age=${maxAge}${revalidateFlag}${noCacheFlag}`
  );

  return false;
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
    let httpResponse: HttpResponse;

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
              httpResponse = await controller(httpRequest);
              if (httpResponse.statusCode >= 400) {
                await transactionHandler.endTransaction();
              }

              if (httpResponse.statusCode === 200 && options?.cache) {
                const isCached = setCacheHeaders(response, httpResponse.body, options.cache);
                if (isCached) return;
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
          httpResponse = await controller(httpRequest);

          if (httpResponse.statusCode === 200 && options?.cache) {
            const isCached = setCacheHeaders(response, httpResponse.body, options.cache);
            if (isCached) return;
          }

          response.status(httpResponse.statusCode).json(httpResponse.body);
        });
      } catch (error) {
        throw error;
      }
    }
  };
};
