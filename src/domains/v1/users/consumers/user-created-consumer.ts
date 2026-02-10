import { inject, injectable } from 'tsyringe';
import { BrokerServer } from '../../../../data/protocols/broker-servers/broker-server';
import { BrokerInstanceTokens } from '../../../../core/helpers/enums';
import { Consumer, BrokerServerConfigEnum } from '../../../../data/protocols/broker-servers';
import { User } from '../entities';

@injectable()
export class UserCreatedConsumer implements Consumer {
  private readonly QUEUE_NAME = BrokerServerConfigEnum.QUEUE_USER_CREATED;
  
  constructor(
    @inject(BrokerInstanceTokens.RABBITMQ_SERVER)
    private readonly broker: BrokerServer
  ) {}

  async consume(user: User): Promise<void> {
    console.log('User Created:', user);
  }

  async register(): Promise<void> {
    await this.broker.consumeMessage(this.QUEUE_NAME, (message: any) => this.consume(JSON.parse(message.content)));
  }
}
