import { MongoClient, Collection } from 'mongodb';

class MongoHelper {
  public client: MongoClient;
  public uri: string;

  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  }

  getCollection (name: string): Collection {
    return this.client.db().collection(name);
  }
}

export default new MongoHelper();
