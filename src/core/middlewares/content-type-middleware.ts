import { httpResponse, HttpStatusCode } from '../helpers/http';
import { HttpResponse, Middleware } from '../protocols';

export class ContentTypeMiddleware implements Middleware {
  async handle(
    request: { ["content-type"]?: string } = {}
  ): Promise<HttpResponse> {
    if (!request["content-type"]) {
      return httpResponse(HttpStatusCode.OK);
    }
    const allowedContentTypes = [
      "application/json",
      "application/x-www-form-urlencoded",
    ];
    if (!allowedContentTypes.includes(request["content-type"])) {
      return httpResponse(HttpStatusCode.UNSUPPORTED_MEDIA_TYPE, {
        message: "Unsupported Media Type",
      });
    }

    return httpResponse(HttpStatusCode.OK);
  }
}
