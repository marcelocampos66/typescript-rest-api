import { inject, injectable } from 'tsyringe';
import { ObjectId } from 'mongodb';
import { UserRepository } from '../../users/repositories';
import { compare } from '../../../../infra/cryptography/bcrypt';
import { encrypt } from '../../../../infra/cryptography/jwt';

type UserDocument = {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
}

@injectable()
export class AuthService {
  private readonly userRepository: UserRepository;

  constructor(
    @inject('UserRepository') userRepository: UserRepository
  ) {
    this.userRepository = userRepository;
  }

  private formatPayload(user: UserDocument): TokenPayload {
    return ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });
  }

  public async authenticate(credentials: TCredentials) {
    const { email, password } = credentials;
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return;
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return;
    }

    const payload: TokenPayload = this.formatPayload(user as UserDocument);
    const token = await encrypt(payload);

    return { token };
  }
}
