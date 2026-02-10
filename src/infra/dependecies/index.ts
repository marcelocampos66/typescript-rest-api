import { container } from 'tsyringe';
import { BrokerInstanceTokens, CryptographyContainerInstanceTokens } from '../../core/helpers/enums';
import { Cryptography, JwtCryptography } from '../cryptography';
import { BrokerServer } from '../../data/protocols/broker-servers';
import { RabbitMQServer } from '../broker-servers/rabbitmq-server';

export const registerCryptographyInstances = () => {
  container.registerSingleton<Cryptography>(CryptographyContainerInstanceTokens.CRYPTO_HELPER, Cryptography);
  container.registerSingleton<JwtCryptography>(CryptographyContainerInstanceTokens.JWT_CRYPTO_HELPER, JwtCryptography);
}

export const registerBrokerInstances = () => {
  container.registerSingleton<BrokerServer>(BrokerInstanceTokens.RABBITMQ_SERVER, RabbitMQServer);
}
