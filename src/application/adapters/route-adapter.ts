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

/*
export function responseCached(
  restData: { res: Response; body: any },
  cacheData: {
    maxAge: number; //seconds
    type: "public" | "private";
    noCacheType?: "no-store" | "no-cache" | "both";
    revalidate: "must-revalidate" | "proxy-revalidate" | "no-revalidate";
  }
) {
  const { res, body } = restData;
  const {
    maxAge,
    type,
    revalidate = "no-revalidate",
  } = cacheData;

  const bodyJson = "toJson" in body ? body.toJson() : body;
  //const bodyRaw = JSON.stringify(bodyJson);

  //   const hash = crypto.createHash("sha256").update(bodyRaw).digest("base64");

  //   if (res.req.headers["if-none-match"] === hash) {
  //     console.log("ETag hit");
  //     res.status(304).end(); // Not Modified
  //     return;
  //   }

  //   res.setHeader("ETag", hash);

  //const immutableFlag = immutable ? ", immutable" : "";

  const revalidateFlag =
    revalidate === "no-revalidate" ? "" : `, ${revalidate}`;

  let noCacheFlag = "";

  switch (cacheData.noCacheType) {
    case "no-store":
      noCacheFlag = ", no-store";
      break;
    case "no-cache":
      noCacheFlag = ", no-cache";
      break;
    case "both":
      noCacheFlag = ", no-store, no-cache";
      break;
  }

  res.setHeader(
    "Cache-Control",
    `${type}, max-age=${maxAge}${revalidateFlag}${noCacheFlag}`
  );

  //console.log("miss");
  res.send(bodyJson);
}
*/

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

          response.status(httpResponse.statusCode).json(httpResponse.body);
        });
      } catch (error) {
        throw error;
      }
    }
  };
};
