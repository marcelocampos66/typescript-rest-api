import 'reflect-metadata';
import 'dotenv/config';
import { container } from 'tsyringe';
import '../core/container';
import logger from './config/logger';
import MongoClientProvider from '../infra/database/mongodb/mongo-client-provider';
import { ExpressServerAdapter } from './adapters';
import expressConfigRoutes from '../routes/routes'
import { ContentTypeMiddleware } from '../core/middlewares';
import { PORT, MONGO_DB_NAME, MONGO_DB_POOL_SIZE, RABBITMQ_URI } from './config/env';
import { BrokerInstanceTokens } from '../core/helpers/enums';
import { BrokerServer } from '../data/protocols/broker-servers/broker-server';
import { UserCreatedConsumer } from '../domains/v1/users/consumers/user-created-consumer';

(async () => {
  try {
    await MongoClientProvider.connect({
      dbName: MONGO_DB_NAME,
      appName: 'rest-api',
      maxPoolSize: MONGO_DB_POOL_SIZE,
    });

    const rabbitMQServer = container.resolve<BrokerServer>(BrokerInstanceTokens.RABBITMQ_SERVER);
    await rabbitMQServer.start(RABBITMQ_URI);
    const userCreatedConsumer = container.resolve(UserCreatedConsumer);
    await rabbitMQServer.setupConsumers([userCreatedConsumer]);

    const server = new ExpressServerAdapter();
    server.setupRoutes(expressConfigRoutes);
    server.setupMiddlewares([ContentTypeMiddleware]);
    server.startServer(PORT);
  } catch (error) {
    logger.error('Error on server init', { error });
  }
})();
