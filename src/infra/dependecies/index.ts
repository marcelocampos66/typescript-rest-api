import { container } from 'tsyringe';
import { CryptographyContainerInstanceTokens } from '../../core/helpers/enums';
import { Cryptography, JwtCryptography } from '../cryptography';

export const registerCryptographyInstances = () => {
  container.registerSingleton<Cryptography>(CryptographyContainerInstanceTokens.CRYPTO_HELPER, Cryptography);
  container.registerSingleton<JwtCryptography>(CryptographyContainerInstanceTokens.JWT_CRYPTO_HELPER, JwtCryptography);
}
