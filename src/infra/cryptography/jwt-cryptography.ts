import jwt from  'jsonwebtoken';
import { injectable } from '../../core/dependency-injection';
import { JWT_SECRET } from '../../application/config/env';
import { JwtCrypto } from '../../data/protocols/cryptography';
import { JwtCryptoTokens } from "../../core/helpers/enums";

@injectable()
export class JwtCryptography implements JwtCrypto {
  async encrypt(payload: object): Promise<string> {
    return jwt.sign(
      payload,
      JWT_SECRET,
      {
        algorithm: JwtCryptoTokens.DEFAULT_ALGORITHM,
        expiresIn: JwtCryptoTokens.DEFAULT_TOKEN_EXPIRY_TIME,
      }
    );
  }

  async decrypt(token: string): Promise<Payload> {
    return jwt.verify(token, JWT_SECRET) as Payload;
  }

  async decode(token: string): Promise<TokenPayload> {
    return jwt.decode(token, { json: true }) as TokenPayload;
  }
}
