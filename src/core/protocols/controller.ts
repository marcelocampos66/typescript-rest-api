import { HttpResponse } from './http';

export type Controller<T = unknown> = (request: T) => Promise<HttpResponse>
