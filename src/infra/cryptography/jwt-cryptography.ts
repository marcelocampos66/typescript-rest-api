import { injectable } from 'tsyringe';
import jwt from  'jsonwebtoken';
import { JWT_SECRET } from '../../application/config/env';
import { JwtCrypto } from '../../data/protocols/cryptography';

@injectable()
export class JwtCryptography implements JwtCrypto {
  async encrypt(payload: object): Promise<string> {
    return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '12h' });
  }

  async decrypt(token: string): Promise<Payload> {
    return jwt.verify(token, JWT_SECRET) as Payload;
  }

  async decode(token: string): Promise<TokenPayload> {
    return jwt.decode(token, { json: true }) as TokenPayload;
  }
}
