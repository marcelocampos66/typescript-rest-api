import { ClientProvider, ClientProviders, TransactionHandler } from "../../data/protocols/database";
import mongoClientProvider from './mongodb/mongo-client-provider';

export class AppTransactionHandler implements TransactionHandler {
  private readonly clientProvider: ClientProvider;

  constructor(provider: ClientProviders) {
    this.clientProvider = {
      [ClientProviders.MONGODB]: mongoClientProvider,
    }[provider];
  }

  async startTransaction(callback: () => Promise<void>): Promise<void> {
    await this.clientProvider.startTransaction(callback);
  }

  getTransactionSession(): unknown | void {
    return this.clientProvider.getTransactionSession();
  }

  async endTransaction(): Promise<void> {
    await this.clientProvider.endTransaction();
  }
}
