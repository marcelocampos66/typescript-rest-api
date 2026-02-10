import { Consumer } from "./consumer";

export abstract class BrokerServer {
  abstract start(uri: string): Promise<void>;

  abstract createExchange(exchangeName: string, exchangeType: string): Promise<void>;

  abstract createQueue(queueName: string): Promise<void>;

  abstract bindQueue(queueName: string, exchangeName: string, routingKey: string): Promise<void>;

  abstract publishInQueue(queue: string, message: string): void;

  abstract publishInExchange(exchange: string, routingKey: string, message: object): void;

  abstract consumeMessage(queue: string, callback: Function): Promise<void>

  abstract close(): void

  abstract setupQueues(): Promise<void>

  abstract setupConsumers(consumers: Consumer[]): Promise<void>
}

export enum BrokerServerConfigEnum {
  EXCHANGE_NAME = 'users',
  EXCHANGE_TYPE_DIRECT = 'direct',
  ROUTING_KEY_USER_CREATED = 'user-created',
  ROUTING_KEY_USER_UPDATED = 'user-updated',
  ROUTING_KEY_USER_DELETED = 'user-deleted',
  QUEUE_USER_CREATED = 'user-created',
  QUEUE_USER_UPDATED = 'user-updated',
  QUEUE_USER_DELETED = 'user-deleted',
}
