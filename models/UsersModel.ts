import Connection from './Connection';
import { ObjectId } from 'mongodb';

class UsersModel extends Connection {
  constructor() {
    super();
  }

  public getUserByEmail(email: string) {
    return this.connection()
      .then((db) => db.collection('users').findOne({ email }));
  }

  public async getAllUsers() {
    return this.connection()
      .then((db) => db.collection('users').find().toArray());
  }

  public async getUserById(id: string) {
    return this.connection()
      .then((db) => db.collection('users').findOne({ _id: new ObjectId(id) }));
  }

  public async registerUser(userData: IUserData) {
    return this.connection()
      .then((db) => db.collection('users').insertOne(userData));
  }

  public async updateUser(id: string, newUserData: IUserData) {
    return this.connection()
      .then((db) => db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set: newUserData },
      ));
  }

  public async deleteUser(id: string) {
    return this.connection()
      .then((db) => db.collection('users').deleteOne({ _id: new ObjectId(id) }));
  }

  public async getUserByEmailAndPassword(email: string, password: string) {
    return this.connection()
      .then((db) => db.collection('users').findOne({ email, password }));
  }
  
}

export default UsersModel;
