import { Channel, connect, ChannelModel } from 'amqplib';
import { BrokerServer, BrokerServerConfigEnum, Consumer } from '../../data/protocols/broker-servers';
import logger from '../../application/config/logger';

export class RabbitMQServer implements BrokerServer {
  private connection: ChannelModel | undefined;
  private channel: Channel | undefined;

  public async start(uri: string): Promise<void> {
    this.connection = await connect(uri);
    this.channel = await this.connection.createChannel();
    await this.setupQueues();
    logger.info('RabbitMQ server started');
  }

  public async createExchange(exchangeName: string, exchangeType: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not found');
    }
    await this.channel.assertExchange(exchangeName, exchangeType, { durable: true });
    logger.info(`Exchange ${exchangeName} created`);
  }

  public async createQueue(queueName: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not found');
    }
    await this.channel.assertQueue(queueName, { durable: true });
    logger.info(`Queue ${queueName} created`);
  }

  public async bindQueue(queueName: string, exchangeName: string, routingKey: string): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not found');
    }
    await this.channel.bindQueue(queueName, exchangeName, routingKey);
    logger.info(`Queue ${queueName} bound to exchange ${exchangeName} with routing key ${routingKey}`);
  }

  public publishInQueue(queue: string, message: string): void {
    if (!this.channel) {
      throw new Error('Channel not found');
    }
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  public publishInExchange(exchange: string, routingKey: string, message: object): void {
    if (!this.channel) {
      throw new Error('Channel not found');
    }
    this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
  }

  public async consumeMessage(queue: string, callback: Function): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not found');
    }
    await this.channel.consume(queue, (message) => {
      if (message) {
        callback(message);
        this.channel!.ack(message);
      }
    });
  }

  public async close(): Promise<void> {
    this.connection.close();
    logger.info('RabbitMQ connection closed');
  }

  public async setupQueues(): Promise<void> {
    try {
      await this.createExchange(BrokerServerConfigEnum.EXCHANGE_NAME, BrokerServerConfigEnum.EXCHANGE_TYPE_DIRECT);
      await this.createQueue(BrokerServerConfigEnum.QUEUE_USER_CREATED);
      await this.bindQueue(
        BrokerServerConfigEnum.QUEUE_USER_CREATED,
        BrokerServerConfigEnum.EXCHANGE_NAME,
        BrokerServerConfigEnum.ROUTING_KEY_USER_CREATED,
      );
    } catch (error) {
      logger.error('Error on setup queues', { error });
    }
  }

  public async setupConsumers(consumers: Consumer[]): Promise<void> {
    for (const consumer of consumers) {
      await consumer.register();
    }
  }
}
