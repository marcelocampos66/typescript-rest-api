import { Request, Response, NextFunction } from 'express'
import { HttpResponse, Middleware } from '../../core/protocols';

export const middlewareAdapter = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest = {
      accessToken: request.headers?.['authorization'],
      ...(request.headers || {})
    }
    const httpResponse: HttpResponse = await middleware.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      Object.assign(request, httpResponse.body)
      next()
    } else {
      response.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
