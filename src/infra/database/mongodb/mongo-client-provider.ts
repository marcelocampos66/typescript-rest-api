import { connect, disconnect } from 'mongoose';
import { MONGO_DB_HOST, MONGO_DB } from '../../../api/config/envs';

class MongoClientProvider {
  async connect() {
    await connect(`mongodb://${MONGO_DB_HOST}`, { dbName: MONGO_DB });
  }

  async disconnect() {
    await disconnect();
  }
}

export default new MongoClientProvider();
