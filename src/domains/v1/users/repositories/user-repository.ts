import MongoClientProvider from '../../../../infra/mongo-client-provider';
import { injectable } from 'tsyringe';
import { ObjectId } from 'mongodb';
import { userDTO, userUpdateDTO } from '../DTOs';
import { Collections } from '../../../../common/helpers/enum-helper';

@injectable()
export class UserRepository {
  public getUserByEmail(email: string) {
    const usersCollection = MongoClientProvider.getCollection(Collections.USERS);
    
    return usersCollection.findOne({ email });
  }

  public async registerUser(userData: userDTO) {
    const usersCollection = MongoClientProvider.getCollection(Collections.USERS);

    return usersCollection.insertOne(userData);
  }

  public async getAllUsers() {
    const usersCollection = MongoClientProvider.getCollection(Collections.USERS);

    return usersCollection.find().toArray();
  }

  public async getUserById(userId: string) {
    const usersCollection = MongoClientProvider.getCollection(Collections.USERS);

    return usersCollection.findOne({ _id: new ObjectId(userId) });
  }

  public async updateUser(id: string, newUserData: userUpdateDTO) {
    const usersCollection = MongoClientProvider.getCollection(Collections.USERS);
    
    return usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: newUserData },
    );
  }

  public async deleteUser(userId: string) {
    const usersCollection = MongoClientProvider.getCollection(Collections.USERS);

    return usersCollection.deleteOne({ _id: new ObjectId(userId) });
  }
}
