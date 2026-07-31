import { inject, injectable } from '../../core/dependency-injection';
import { HttpClientInstanceTokens } from '../../core/dependency-injection/tokens';
import { AxiosHttpClient } from '../http-clients/axios-http-client';
import { AddressLookupService, Address } from '../../data/protocols/external-services';
import { NotFoundError } from '../../core/errors';
import { VIA_CEP_BASE_URL } from '../../application/config/env';

type ViaCepAddress = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // city
  uf: string;
  estado: string;
  regiao: string;
  ddd: string;
  ibge: string;
  siafi: string;
};

type ViaCepRawResponse = ViaCepAddress & { erro?: boolean };

@injectable()
export class ViaCepAddressLookupService implements AddressLookupService {
  private readonly httpClient: AxiosHttpClient;

  constructor(
    @inject(HttpClientInstanceTokens.AXIOS_HTTP_CLIENT) httpClient: AxiosHttpClient,
  ) {
    this.httpClient = httpClient;
  }

  async findByCep(cep: string): Promise<Address> {
    const { body } = await this.httpClient.get<ViaCepRawResponse>(`${VIA_CEP_BASE_URL}/${cep}/json/`);

    if (body.erro) {
      throw new NotFoundError('CEP not found');
    }

    return {
      street: body.logradouro,
      city: body.localidade,
      district: body.bairro,
      zipcode: body.cep,
    };
  }
}
