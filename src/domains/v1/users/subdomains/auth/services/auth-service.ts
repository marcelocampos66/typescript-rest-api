import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../../../repositories';
import { ContainerInstanceTokens, CryptographyContainerInstanceTokens } from '../../../../../../core/helpers/enums';
import { User } from '../../../entities';
import { Result } from '../../../../../../core/protocols/repository';
import { Cryptography, JwtCryptography } from '../../../../../../infra/cryptography';
import { BadRequestError, NotFoundError } from '../../../../../../core/errors';
import { UsersErrorMessages } from '../../../helpers/enums';
import { AuthErrorMessages } from '../helpers/enums';

class AuthServiceHelperFunctions {
  static formatPayload(user: Result<User>): TokenPayload {
    return ({
      id: user.id.toString(),
      email: user.email,
    });
  }
}

@injectable()
export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly cryptography: Cryptography;
  private readonly jwtCryptography: JwtCryptography;

  constructor(
    @inject(ContainerInstanceTokens.USER_REPOSITORY_V1) userRepository: UserRepository,
    @inject(CryptographyContainerInstanceTokens.CRYPTO_HELPER) cryptography: Cryptography,
    @inject(CryptographyContainerInstanceTokens.JWT_CRYPTO_HELPER) jwtCryptography: JwtCryptography,
  ) {
    this.userRepository = userRepository;
    this.cryptography = cryptography;
    this.jwtCryptography = jwtCryptography;
  }

  public async auth(credentials: AuthService.Credentials) {
    const { email, password } = credentials;
    const user = await this.userRepository.findOne({
      filters: { email }
    });
    if (!user) {
      throw new NotFoundError(UsersErrorMessages.notFound);
    }

    const isPasswordCorrect = await this.cryptography.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestError(AuthErrorMessages.invalidCredentials);
    }

    const payload: TokenPayload = AuthServiceHelperFunctions.formatPayload(user);
    const accessToken = await this.jwtCryptography.encrypt(payload);

    return { accessToken };
  }
}

declare namespace AuthService {
  type Credentials = {
    email: string;
    password: string;
  }
}
