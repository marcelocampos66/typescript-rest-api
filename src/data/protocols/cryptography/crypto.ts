export interface Crypto {
  encrypt(text: string): Promise<string>;

  decrypt(hash: string): Promise<string>;

  compare(text: string, hash: string): Promise<boolean>;
}
