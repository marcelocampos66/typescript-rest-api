export type Address = {
  street: string;
  district: string;
  city: string;
  zipcode: string;
}

export interface AddressLookupService {
  findByCep(cep: string): Promise<Address>;
}
