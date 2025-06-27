import 'dotenv/config';
import { inject, injectable } from 'tsyringe';
import { Cryptography } from '../../../../infra/cryptography';
import { UserRepository } from '../repositories';
import { User } from '../entities';
import { ContainerInstanceTokens, CryptographyContainerInstanceTokens } from '../../../../core/helpers/enums';
import { Service } from '../../../../core/base';
import { ConflictError } from '../../../../core/errors';
import { UsersErrorMessages } from '../helpers/enums';

@injectable()
export class UserService extends Service<User> {
  private readonly crypto: Cryptography;
  
  constructor(
    @inject(ContainerInstanceTokens.USER_REPOSITORY_V1) userRepository: UserRepository,
    @inject(CryptographyContainerInstanceTokens.CRYPTO_HELPER) cryptoHelper: Cryptography,
  ) {
    super(userRepository);
    this.crypto = cryptoHelper;
  }

  public async createUser(userData: User) {
    const { email, name, password } = userData;
    const emailAlreadyRegistered = await this.repository.findOne({
      filters: { email }
    });
    if (emailAlreadyRegistered) {
      throw new ConflictError(UsersErrorMessages.emailAlreadyRegistered)
    }

    const hashedPassword = await this.crypto.encrypt(password);
    const newUserData = { email, name, password: hashedPassword };

    return this.repository.create(newUserData);
  }

  public async updateProfile(userId: string, newUserData: Partial<User>) {
    const { password, email, ...rest } = newUserData;
    const hashedPassword = await this.crypto.encrypt(password);
    const updateUserData = { ...rest, password: hashedPassword };

    await this.repository.update(userId, updateUserData);
  }
}
