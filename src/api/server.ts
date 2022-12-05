import 'reflect-metadata';
import 'dotenv/config';
import '../common/container';
import App from './App';
import MongoHelper from '../infra/mongo-client-provider';

const { PORT, MONGO_DB_HOST, MONGO_DB } = process.env;

const URL = `mongodb://${(MONGO_DB_HOST || '127.0.0.1:27017')}/${(MONGO_DB || 'users')}`;
const serverPort = (Number(PORT) || 3001);

MongoHelper.connect(URL)
  .then(async () => {
    const server = new App(serverPort);
    server.startServer();
  })
  .catch(console.error);
