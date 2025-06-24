export type ConnectionOptions = { dbName: string; appName?: string; maxPoolSize?: number; debug?: boolean };

export abstract class ClientProvider {
  abstract connect(options?: ConnectionOptions): void;

  abstract disconnect(): void;

  abstract startTransaction(callback: () => Promise<void>): Promise<unknown | void>;

  abstract getTransactionSession(): unknown | void;

  abstract endTransaction(): Promise<void>;
}
