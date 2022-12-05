import MongoClientProvider from '../../../../infra/mongo-client-provider';
import { injectable } from 'tsyringe';
import { ObjectId } from 'mongodb';
import { userDTO, userUpdateDTO } from '../DTOs';
import { User } from '../models';

@injectable()
export class UserRepository {
  public getUserByEmail(email: string) {
    return User.findOne({ email });
  }

  public async registerUser(userData: userDTO) {
    return User.create(userData);
  }

  public async getAllUsers() {
    return User.find();
  }

  public async getUserById(userId: string) {
    return User.findById(new ObjectId(userId));
  }

  public async updateUser(userId: string, newUserData: userUpdateDTO) {
    return User.updateOne(
      { _id: new ObjectId(userId) },
      newUserData,
    );
  }

  public async deleteUser(userId: string) {
    return User.deleteOne({ _id: new ObjectId(userId) });
  }
}
