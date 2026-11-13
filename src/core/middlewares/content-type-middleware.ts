import { httpResponse, HttpStatusCode } from '../helpers/http';
import { HttpResponse, Middleware } from '../protocols';
import {ContentTypeMiddlewareErrors} from "../helpers/enums";

const ALLOWED_CONTENT_TYPES = [
  "application/json",
  "application/x-www-form-urlencoded",
];

export class ContentTypeMiddleware implements Middleware {
  async handle(
    request: { ['content-type']?: string } = {}
  ): Promise<HttpResponse> {
    if (!request['content-type']) {
      return httpResponse(HttpStatusCode.OK);
    }
    
    if (!ALLOWED_CONTENT_TYPES.includes(request['content-type'])) {
      return httpResponse(HttpStatusCode.UNSUPPORTED_MEDIA_TYPE, {
        message: ContentTypeMiddlewareErrors.UNSUPPORTED_MEDIA_TYPE,
      });
    }

    return httpResponse(HttpStatusCode.OK);
  }
}
