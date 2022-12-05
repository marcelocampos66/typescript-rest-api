type TokenPayload = {
  id: string;
  name: string;
  email: string;
}

type Payload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

type TCredentials = {
  email: string;
  password: string;
}
