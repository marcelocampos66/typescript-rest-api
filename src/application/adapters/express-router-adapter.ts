import { Router as ExpressRouter, RequestHandler } from 'express';
import { Router, RouteHandler } from '../../core/protocols';

export class ExpressRouterAdapter implements Router {
  constructor(private readonly router: ExpressRouter) {}

  get(path: string, handlers: RouteHandler[]): void {
    this.router.get(path, handlers as RequestHandler[]);
  }

  post(path: string, handlers: RouteHandler[]): void {
    this.router.post(path, handlers as RequestHandler[]);
  }

  put(path: string, handlers: RouteHandler[]): void {
    this.router.put(path, handlers as RequestHandler[]);
  }

  patch(path: string, handlers: RouteHandler[]): void {
    this.router.patch(path, handlers as RequestHandler[]);
  }

  delete(path: string, handlers: RouteHandler[]): void {
    this.router.delete(path, handlers as RequestHandler[]);
  }

  head(path: string, handlers: RouteHandler[]): void {
    this.router.head(path, handlers as RequestHandler[]);
  }
}
