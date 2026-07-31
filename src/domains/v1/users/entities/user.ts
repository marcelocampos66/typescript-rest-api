import { Entity } from '../../../../core/protocols'

type Props = {
  name: string;
  email: string;
  password: string;
  address?: {
    street: string;
    district: string;
    city: string;
    zipcode: string;
    number?: string;
  }
}

export class User extends Entity {
  public name: string;
  public email: string;
  public password: string;
  public address?: {
    street: string;
    district: string;
    city: string;
    zipcode: string;
    number?: string;
  }

  constructor({ name, email, password, address }: Props) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
    if (address) {
      this.address = address;
    }
  }
}
