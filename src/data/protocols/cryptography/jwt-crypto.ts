export interface JwtCrypto {
  encrypt(payload: unknown): Promise<string>;

  decrypt(token: string): Promise<Payload>;

  decode(token: string): Promise<TokenPayload>
}
