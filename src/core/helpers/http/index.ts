import { HttpResponse } from '../../protocols';

type ResponseBody = undefined | null | unknown | Error;

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNSUPPORTED_MEDIA_TYPE = 415,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

export const httpResponse = (statusCode: number, body?: ResponseBody): HttpResponse => ({
  statusCode,
  body,
});

export const serverError = (error: Error): HttpResponse => ({
  statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
  body: { error: error.message }
});
