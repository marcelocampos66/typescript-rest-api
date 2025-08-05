import { Request, Response, NextFunction } from 'express'
import { HttpResponse, Middleware } from '../../core/protocols';

export const middlewareAdapter = (middleware: Middleware, ...args: unknown[]) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest = {
      accessToken: request.headers?.['authorization'],
      ...(request.headers || {}),
      ...(request.body && { body: request.body }),
      ...(request.params && { params: request.params }),
      ...(request.query && { query: request.query }),
    }
    
    const httpResponse: HttpResponse = await middleware.handle(httpRequest, ...args);
    
    if (httpResponse.statusCode === 200) {
      Object.assign(request, httpResponse.body || {});
      next()
    } else {
      response.status(httpResponse.statusCode).json(httpResponse.body);
    }
  }
}
