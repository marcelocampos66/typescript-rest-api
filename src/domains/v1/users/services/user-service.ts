import 'dotenv/config';
import { inject, injectable } from '../../../../core/dependency-injection';
import { Cryptography } from '../../../../infra/cryptography';
import { UserRepository } from '../repositories';
import { User } from '../entities';
import {
  ContainerInstanceTokens,
  CryptographyContainerInstanceTokens,
} from '../../../../core/dependency-injection/tokens';
import { Service } from '../../../../core/base';
import { ConflictError } from '../../../../core/errors';
import { UsersErrorMessages } from '../helpers/enums';
import { userDTO, userUpdateDTO } from '../DTOs';

@injectable()
export class UserService extends Service<User> {
  private readonly crypto: Cryptography;
  
  constructor(
    @inject(ContainerInstanceTokens.USER_REPOSITORY_V1) userRepository: UserRepository,
    @inject(CryptographyContainerInstanceTokens.CRYPTO_HELPER) crypto: Cryptography,
  ) {
    super(userRepository);
    this.crypto = crypto;
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
    const newUserData = userDTO({ email, name, password: hashedPassword });

    return this.repository.create(newUserData);
  }

  public async updateProfile(userId: string, newUserData: Partial<User>) {
    const { password, email, ...rest } = newUserData;
    const hashedPassword = await this.crypto.encrypt(password);
    const updateUserData = userUpdateDTO({ ...rest, password: hashedPassword });

    await this.repository.update(userId, updateUserData);
  }
}
