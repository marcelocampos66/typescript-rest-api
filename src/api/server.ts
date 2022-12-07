import 'reflect-metadata';
import 'dotenv/config';
import '../common/container';
import App from './App';
import MongoHelper from '../infra/database/mongodb/mongo-client-provider';
import { PORT } from './config/envs';

const serverPort = Number(PORT);

MongoHelper.connect()
  .then(async () => {
    const server = new App(serverPort);
    server.startServer();
  })
  .catch(console.error);
