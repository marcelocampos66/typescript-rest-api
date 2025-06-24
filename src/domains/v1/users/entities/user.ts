type UserProps = {
  name: string;
  email: string;
  password: string;
}

export class User {
  public name: string;
  public email: string;
  public password: string;

  constructor({ name, email, password }: UserProps) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
