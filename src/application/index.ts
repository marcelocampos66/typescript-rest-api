import 'reflect-metadata';
import 'dotenv/config';
import '../core/container';
import logger from './config/logger';
import ApplicationServer from './application-server';
import MongoClientProvider from '../infra/database/mongodb/mongo-client-provider';
import { PORT, MONGO_DB_NAME, MONGO_DB_POOL_SIZE } from './config/env';

(async () => {
  try {
    await MongoClientProvider.connect({
      dbName: MONGO_DB_NAME,
      appName: 'rest-api',
      maxPoolSize: MONGO_DB_POOL_SIZE,
    });
    const server = new ApplicationServer();
    server.startServer(PORT);
  } catch (error) {
    logger.error('Error on server init', { error });
  }
})();
