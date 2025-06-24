export enum ClientProviders {
  MONGODB = 'MONGODB',
}

export abstract class TransactionHandler {
  abstract startTransaction(callback: () => Promise<void>): Promise<void>;

  abstract endTransaction(): Promise<void>;

  abstract getTransactionSession(): unknown | void;
}
