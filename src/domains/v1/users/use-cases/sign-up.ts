import { inject, injectable } from '../../../../core/dependency-injection';
import { UseCase } from '../../../../core/protocols';
import { User } from '../entities';
import { UserService } from '../services';
import {
  BrokerInstanceTokens,
  ContainerInstanceTokens,
  CryptographyContainerInstanceTokens,
  ExternalServiceInstanceTokens,
} from '../../../../core/dependency-injection/tokens';
import { BadRequestError, ConflictError } from '../../../../core/errors';
import { UsersErrorMessages } from '../helpers/enums';
import { Cryptography } from '../../../../infra/cryptography';
import { userDTO } from '../DTOs';
import { BrokerServer, BrokerServerConfigEnum } from '../../../../data/protocols/broker-servers';
import { AddressLookupService } from "../../../../data/protocols/external-services";

@injectable()
export class SignUp implements UseCase<SignUp.Input, SignUp.Output> {
  private readonly userService: UserService;
  private readonly cryptography: Cryptography;
  private readonly broker: BrokerServer;
  private readonly addressLookupService: AddressLookupService;

  constructor(
    @inject(ContainerInstanceTokens.USER_SERVICE_V1) userService: UserService,
    @inject(CryptographyContainerInstanceTokens.CRYPTO_HELPER) cryptography: Cryptography,
    @inject(BrokerInstanceTokens.RABBITMQ_SERVER) broker: BrokerServer,
    @inject(ExternalServiceInstanceTokens.VIA_CEP_ADDRESS_LOOKUP_SERVICE) addressLookupService: AddressLookupService,
  ) {
    this.userService = userService;
    this.cryptography = cryptography;
    this.broker = broker;
    this.addressLookupService = addressLookupService;
  }

  async execute(props: SignUp.Input): Promise<SignUp.Output> {
    if (props.password !== props.passwordConfirmation) {
      throw new BadRequestError(UsersErrorMessages.passwordsNotMatched);
    }
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

    if (props.cep) {
      newUserData.address = await this.addressLookupService.findByCep(props.cep);
    }

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
    cep?: string;
  }

  type Output = User;
}
