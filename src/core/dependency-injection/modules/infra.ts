import { container } from '..';
import { BrokerInstanceTokens, ConsumerInstanceTokens, CryptographyContainerInstanceTokens, ExternalServiceInstanceTokens, HttpClientInstanceTokens } from '../tokens';
import { Cryptography, JwtCryptography } from '../../../infra/cryptography';
import { BrokerServer } from '../../../data/protocols/broker-servers';
import { RabbitMQServer } from '../../../infra/broker-servers/rabbitmq-server';
import { UserCreatedConsumer } from '../../../domains/v1/users/consumers/user-created-consumer';
import { AxiosHttpClient } from '../../../infra/http-clients/axios-http-client';
import { ViaCepAddressLookupService } from '../../../infra/external-services/via-cep-address-lookup-service';

export const registerInfraModule = () => {
  // Cryptography
  container.register<Cryptography>(CryptographyContainerInstanceTokens.CRYPTO_HELPER, Cryptography);
  container.register<JwtCryptography>(CryptographyContainerInstanceTokens.JWT_CRYPTO_HELPER, JwtCryptography);

  // Broker
  container.registerSingleton<BrokerServer>(BrokerInstanceTokens.RABBITMQ_SERVER, RabbitMQServer);

  // Consumers
  container.register<UserCreatedConsumer>(ConsumerInstanceTokens.USER_CREATED_CONSUMER, UserCreatedConsumer);

  // Http Clients
  container.registerSingleton<AxiosHttpClient>(HttpClientInstanceTokens.AXIOS_HTTP_CLIENT, AxiosHttpClient);

  // External Services
  container.register<ViaCepAddressLookupService>(ExternalServiceInstanceTokens.VIA_CEP_ADDRESS_LOOKUP_SERVICE, ViaCepAddressLookupService);
};
