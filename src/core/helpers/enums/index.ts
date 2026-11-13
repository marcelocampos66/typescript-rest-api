export enum JwtCryptoTokens {
  DEFAULT_ALGORITHM = 'HS256',
  DEFAULT_TOKEN_EXPIRY_TIME = '12h',
}

export enum AuthMiddlewareErrors {
  MISSING_AUTH_TOKEN = 'missing auth token',
  JWT_MALFORMED= 'jwt malformed',
}

export enum ContentTypeMiddlewareErrors {
  UNSUPPORTED_MEDIA_TYPE = 'Unsupported Media Type'
}
