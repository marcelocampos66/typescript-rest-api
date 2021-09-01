import 'dotenv/config';
import models from '../models/models';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

type TokenData = {
  id: string;
  email: string;
}

class UserService {
  jwtConfig: SignOptions;
  jwtSecret: Secret;
  private userModel = models.users;
  constructor() {
    this.jwtConfig = { expiresIn: '1d', algorithm: 'HS256' };
    this.jwtSecret = process.env.JWT_SECRET || '';
  }

  private createToken(payload: TokenData) {
    const token = jwt.sign(payload, this.jwtSecret, this.jwtConfig);
    return token;
  }

  public async getAllUsers() {
    const result = await this.userModel.getAllUsers();
    return result;
  }

  public async getUserById(id: string) {
    const user = await this.userModel.getUserById(id);
    if (!user) {
      return { error: { message: 'User not found' } }
    }
    return user;
  }

  public async registerUser(userData: IUserData) {
    const { email, name, birthdate, password } = userData;
    const newUserData = { email, name, birthdate, password };
    const { insertedId } = await this.userModel.registerUser(newUserData);
    const userId = insertedId.toString();
    const newUser = await this.userModel.getUserById(userId);
    const token = this.createToken({ id: userId, email })
    return { token, newUser };
  }

  public async updateUser(id: string, newUserData: IUserData) {
    await this.userModel.updateUser(id, newUserData);
    const updatedUser = await this.userModel.getUserById(id);
    return updatedUser;
  }

  public async deleteUser(id: string) {
    await this.userModel.deleteUser(id);
    return { message: 'User deleted!' }
  }

  public async login(email: string, password: string) {
    const result = await this.userModel.getUserByEmailAndPassword(email, password);
    if (!result) {
      return ({ error: { message: 'Email or password incorrect' } });
    };
    const userId = result._id.toString();
    const token = this.createToken({ id: userId, email })
    return { token }
  }

}

export default UserService;
