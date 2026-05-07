import { Request, Response, NextFunction } from 'express'
import { HttpResponse, Middleware } from '../../core/protocols';
import { HttpStatusCode } from '../../core/helpers/http';

export const middlewareAdapter = (middleware: Middleware, ...args: unknown[]) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const httpRequest = {
        accessToken: request.headers?.['authorization'],
        ...(request.headers || {}),
        ...(request.body && { body: request.body }),
        ...(request.params && { params: request.params }),
        ...(request.query && { query: request.query }),
      }
    
      const httpResponse: HttpResponse = await middleware.handle(httpRequest, ...args);
    
      if (httpResponse.statusCode === HttpStatusCode.OK) {
        Object.assign(request, httpResponse.body || {});
        next()
      } else {
        response.status(httpResponse.statusCode).json(httpResponse.body);
      }
    } catch (error) {
      next(error);
    }
  }
}
