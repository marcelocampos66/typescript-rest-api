import MongoHelper from '../../../../common/helpers/MongoHelper';
import { ObjectId } from 'mongodb';
import { injectable } from 'tsyringe';
import { userDTO } from '../DTOs';
import { Collections } from '../../../../common/helpers/enum-helper';

@injectable()
export class UserRepository {
  public getUserByEmail(email: string) {
    // return this.connection()
    //   .then((db) => db.collection('users').findOne({ email }));
  }

  public async getAllUsers() {
    // return this.connection()
    //   .then((db) => db.collection('users').find().toArray());
  }

  public async getUserById(id: string) {
    // return this.connection()
    //   .then((db) => db.collection('users').findOne({ _id: new ObjectId(id) }));
  }

  public async registerUser(userData: userDTO) {
    const usersCollection = MongoHelper.getCollection(Collections.USERS);

    return usersCollection.insertOne(userData);
  }

  public async updateUser(id: string, newUserData: userDTO) {
    // return this.connection()
    //   .then((db) => db.collection('users').updateOne(
    //     { _id: new ObjectId(id) },
    //     { $set: newUserData },
    //   ));
  }

  public async deleteUser(id: string) {
    // return this.connection()
    //   .then((db) => db.collection('users').deleteOne({ _id: new ObjectId(id) }));
  }

  public async getUserByEmailAndPassword(email: string, password: string) {
    // return this.connection()
    //   .then((db) => db.collection('users').findOne({ email, password }));
  }
}
