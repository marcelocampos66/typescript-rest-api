import { container } from '..';
import { BrokerInstanceTokens, ConsumerInstanceTokens, CryptographyContainerInstanceTokens } from '../../helpers/enums';
import { Cryptography, JwtCryptography } from '../../../infra/cryptography';
import { BrokerServer } from '../../../data/protocols/broker-servers';
import { RabbitMQServer } from '../../../infra/broker-servers/rabbitmq-server';
import { UserCreatedConsumer } from '../../../domains/v1/users/consumers/user-created-consumer';

export const registerInfraModule = () => {
  // Cryptography
  container.register<Cryptography>(CryptographyContainerInstanceTokens.CRYPTO_HELPER, Cryptography);
  container.register<JwtCryptography>(CryptographyContainerInstanceTokens.JWT_CRYPTO_HELPER, JwtCryptography);

  // Broker
  container.registerSingleton<BrokerServer>(BrokerInstanceTokens.RABBITMQ_SERVER, RabbitMQServer);

  // Consumers
  container.register<UserCreatedConsumer>(ConsumerInstanceTokens.USER_CREATED_CONSUMER, UserCreatedConsumer);
};
