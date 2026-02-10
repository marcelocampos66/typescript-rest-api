import 'dotenv/config';

const env = process.env;

export const PORT = Number(env.PORT || 8080);
export const APP_ENV = env.APP_ENV || 'dev';
export const JWT_SECRET = (env.JWT_SECRET || '');
export const MONGO_DB_NAME = (env.MONGO_DB || 'rest-api');
export const MONGO_DB_URL = (env.MONGO_DB_URL || 'mongodb://127.0.0.1:27017');
export const MONGO_DB_POOL_SIZE = Number(env.MONGO_DB_POOL_SIZE || 10);
export const DB_TIMEOUT= Number(env.DB_QUERY_TIMEOUT || 40000);
export const RABBITMQ_URI = env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672';
