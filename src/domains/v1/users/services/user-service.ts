import 'dotenv/config';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import md5 from 'md5';
import { userDTO } from '../DTOs';
import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../repositories';

@injectable()
export class UserService {
  jwtConfig: SignOptions;
  jwtSecret: Secret;
  private readonly userRepository: UserRepository;
  
  constructor(
    @inject('UserRepository') userRepository: UserRepository
  ) {
    this.jwtConfig = { expiresIn: '1d', algorithm: 'HS256' };
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.userRepository = userRepository;
  }

  private createToken(payload: TokenPayload) {
    const token = jwt.sign(payload, this.jwtSecret, this.jwtConfig);
    return token;
  }

  private hashPassword(password: string) {
    return md5(password);
  }

  // public async getAllUsers() {
  //   const result = await this.userModel.getAllUsers();
  //   return result;
  // }

  // public async getUserById(id: string) {
  //   const user = await this.userModel.getUserById(id);
  //   if (!user) {
  //     return { error: { message: 'User not found' } }
  //   }
  //   return user;
  // }

  public async registerUser(userData: userDTO) {
    const { email, name, birthdate, password } = userData;
    const hashedPassword = this.hashPassword(password);
    const newUserData = { email, name, birthdate, password: hashedPassword };
    const { insertedId } = await this.userRepository.registerUser(newUserData);
    const userId = insertedId.toString();
    const newUser = await this.userRepository.getUserById(userId);
    const token = this.createToken({ id: userId, email })
    return { token, newUser };
  }

  // public async updateUser(id: string, newUserData: IUserData) {
  //   const { password, ...otherInfos } = newUserData;
  //   const readyUserData = { ...otherInfos, password: this.hashPassword(password) }
  //   await this.userModel.updateUser(id, readyUserData);
  //   const updatedUser = await this.userModel.getUserById(id);
  //   return updatedUser;
  // }

  // public async deleteUser(id: string) {
  //   await this.userModel.deleteUser(id);
  //   return { message: 'User deleted!' }
  // }

  // public async login(email: string, password: string) {
  //   const hashedPassword = this.hashPassword(password);
  //   const result = await this.userModel.getUserByEmailAndPassword(email, hashedPassword);
  //   if (!result) {
  //     return ({ error: { message: 'Email or password incorrect' } });
  //   };
  //   const userId = result._id.toString();
  //   const token = this.createToken({ id: userId, email })
  //   return { token }
  // }

}
