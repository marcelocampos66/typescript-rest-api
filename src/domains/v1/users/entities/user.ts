import { Entity } from '../../../../core/protocols'

type Props = {
  name: string;
  email: string;
  password: string;
}

export class User extends Entity {
  public name: string;
  public email: string;
  public password: string;

  constructor({ name, email, password }: Props) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
