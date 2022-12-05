import { HttpResponse } from '../protocols';
import { HttpStatusCode } from './enum-helper';

type TBody = undefined | null | unknown | Error;

export const httpResponse = (statusCode: number, body?: TBody): HttpResponse => ({
  statusCode,
  body,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
  body: { error: error.message }
});
