import { container } from "tsyringe";
import { AuthMiddleware } from "../authentication-middleware";
import { RequestValidatorMiddleware } from "../request-validator-middleware";
import { MiddlewareIntanceTokens } from "../../helpers/enums";

export const registerMiddlewareInstances = () => {
  container.registerSingleton<AuthMiddleware>(
    MiddlewareIntanceTokens.AUTH,
    AuthMiddleware
  );
  container.registerSingleton<RequestValidatorMiddleware>(
    MiddlewareIntanceTokens.REQUEST_VALIDATOR,
    RequestValidatorMiddleware
  );
};
