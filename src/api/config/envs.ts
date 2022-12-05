import 'dotenv/config';

const env = process.env;

export const PORT = (env.PORT || 3001);
export const JWT_SECRET = (env.JWT_SECRET || '');
export const MONGO_DB_HOST = (env.MONGO_DB_HOST || '127.0.0.1:27017');
export const MONGO_DB = (env.MONGO_DB || 'rest-api');
