import { HttpResponse } from './';

export interface Middleware<T = unknown> {
  handle(httpRequest: T, ...args: unknown[]): Promise<HttpResponse>;
}
