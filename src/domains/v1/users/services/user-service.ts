import 'dotenv/config';
import { inject, injectable } from 'tsyringe';
import { hash } from '../../../../infra/cryptography/bcrypt';
import { userDTO } from '../DTOs';
import { UserRepository } from '../repositories';

@injectable()
export class UserService {
  private readonly userRepository: UserRepository;
  
  constructor(
    @inject('UserRepository') userRepository: UserRepository
  ) {
    this.userRepository = userRepository;
  }

  public async getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  public async registerUser(userData: userDTO) {
    const { email, name, birthdate, password } = userData;

    const emailAlreadyRegistered = await this.userRepository.getUserByEmail(email);
    if (emailAlreadyRegistered) {
      return;
    }
    const hashedPassword = await hash(password);
    const newUserData = { email, name, birthdate, password: hashedPassword };
    const insertedUser = await this.userRepository.registerUser(newUserData);
    const userId = insertedUser._id.toString();

    return { userId };
  }

  public async getUserById(userId: string) {
    return this.userRepository.getUserById(userId);
  }

  public async updateUser(userId: string, newUserData: userDTO) {
    const { password, email, ...otherInfos } = newUserData;

    const hashedPassword = await hash(password);
    const updateUserData = { ...otherInfos, password: hashedPassword };

    await this.userRepository.updateUser(userId, updateUserData);
  }

  public async deleteUser(userId: string) {
    await this.userRepository.deleteUser(userId);
  }
}
