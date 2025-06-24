export abstract class BrokerServer {
  abstract start(uri: string): Promise<void>;

  abstract createExchange(exchangeName: string, exchangeType: string): Promise<void>;

  abstract createQueue(queueName: string): Promise<void>;

  abstract bindQueue(queueName: string, exchangeName: string, routingKey: string): Promise<void>;

  abstract publishInQueue(queue: string, message: string): void;

  abstract publishInExchange(exchange: string, routingKey: string, message: object): void;

  abstract consumeMessage(queue: string, callback: Function): Promise<void>
}
