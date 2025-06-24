import mongoose from 'mongoose';
import { ClientProvider, ConnectionOptions } from "../../../data/protocols/database/client-provider";
import { MONGO_DB_URL, DB_TIMEOUT } from '../../../application/config/env';
import logger from '../../../application/config/logger';

class MongoClientProvider implements ClientProvider {
  private session: mongoose.ClientSession;

  async connect(options: ConnectionOptions) {
    mongoose.Promise = global.Promise;
    mongoose.connection.on('connecting', () => {
      logger.info('connecting');
    });
    mongoose.connection.on('connected', () => {
      logger.info('connected');
    });
    mongoose.connection.on('close', () => {
      logger.info('connection closed');
    });
    mongoose.connection.on('reconnected', () => {
      logger.info('connection reconnected');
    });
    mongoose.connection.on('reconnectFailed', () => {
      logger.info('connection reconnectFailed');
      process.exit(1);
    });
    mongoose.connection.on('disconnecting', () => {
      logger.info('connection disconnecting');
    });
    mongoose.connection.on('disconnected', () => {
      logger.info('connection disconnected');
    });
    mongoose.connection.on('fullsetup', () => {
      logger.info('Connection full setup to replica set');
    });
    mongoose.connection.on('all', () => {
      logger.info('Connected to all replica set servers');
    });
    mongoose.connection.on('error', (error) => {
      logger.error('Connection error', error);
      if (error.code === 'ECONNREFUSED') {
        process.exit(1);
      }
    });
    mongoose.set("debug", options?.debug || false);
    mongoose.set("maxTimeMS", DB_TIMEOUT);

    await mongoose.connect(
      MONGO_DB_URL,
      Object.assign(
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          minPoolSize: 5,
          maxPoolSize: options?.maxPoolSize || 10,
        },
        options,
      ),
    );
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  async startTransaction(callback: () => Promise<void>): Promise<void> {
    if (mongoose.connection) {
      this.session = await mongoose.connection.startSession();
      await this.session.withTransaction(callback);
    }
  }

  getTransactionSession(): mongoose.ClientSession | void {
    if (this.session) {
      return this.session;
    }
  }

  async endTransaction(): Promise<void> {
    if (this.session) {
      await this.session.endSession();
    }
  }
}

export default new MongoClientProvider();
