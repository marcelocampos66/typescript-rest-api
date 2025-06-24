import { injectable } from 'tsyringe';
import crypto from 'crypto';
import { Crypto } from '../../data/protocols/cryptography';

const ENCRYPTION_KEY = 'c6ca39bbc348aeb914d789e5c61f14cd';
const IV_STRING = 'devinitialvector';

@injectable()
export class Cryptography implements Crypto {
  async encrypt(text: string): Promise<string> {
    let iv = Buffer.from(IV_STRING);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  async decrypt(hash: string): Promise<string> {
    try {
      const textParts = hash.split(":");
      const iv = Buffer.from(textParts.shift() as string, "hex");
      const encryptedText = Buffer.from(textParts.join(":"), "hex");
      const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString();
    } catch (error) {
      return hash;
    }
  }

  async compare(text: string, hash: string): Promise<boolean> {
    const newHash = await this.encrypt(text);

    return newHash === hash;
  }
}
