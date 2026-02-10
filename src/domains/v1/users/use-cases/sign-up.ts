import { inject, injectable } from 'tsyringe';
import { UseCase } from '../../../../core/protocols';
import { User } from '../entities';
import { UserService } from '../services';
import { ContainerInstanceTokens, CryptographyContainerInstanceTokens, BrokerInstanceTokens } from '../../../../core/helpers/enums';
import { ConflictError } from '../../../../core/errors';
import { UsersErrorMessages } from '../helpers/enums';
import { Cryptography } from '../../../../infra/cryptography';
import { userDTO } from '../DTOs';
import { BrokerServer, BrokerServerConfigEnum } from '../../../../data/protocols/broker-servers/broker-server';

@injectable()
export class SignUp implements UseCase<SignUp.Input, SignUp.Output> {
  private readonly userService: UserService;
  private readonly cryptography: Cryptography;
  private readonly broker: BrokerServer;
  
  constructor(
    @inject(ContainerInstanceTokens.USER_SERVICE_V1) userService: UserService,
    @inject(CryptographyContainerInstanceTokens.CRYPTO_HELPER) cryptography: Cryptography,
    @inject(BrokerInstanceTokens.RABBITMQ_SERVER) broker: BrokerServer,
  ) {
    this.userService = userService;
    this.cryptography = cryptography;
    this.broker = broker;
  }

  async execute(props: SignUp.Input): Promise<SignUp.Output> {
    const emailAlreadyRegistered = await this.userService.findOne({
      filters: {
        email: props.email,
      }
    });
    if (emailAlreadyRegistered) {
      throw new ConflictError(UsersErrorMessages.emailAlreadyRegistered);
    }

    const hashedPassword = await this.cryptography.encrypt(props.password);
    const newUserData = userDTO({ ...props, password: hashedPassword });

    const user = await this.userService.create(newUserData);
    this.broker.publishInQueue(BrokerServerConfigEnum.QUEUE_USER_CREATED, JSON.stringify(user));

    return user;
  }
}

declare namespace SignUp {
  type Input = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }

  type Output = User;
}
