declare namespace Express {
  export interface Request {
    payload: jwt.JwtPayload;
  }
}
