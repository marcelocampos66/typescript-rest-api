interface IUserData {
  email: string;
  name: string;
  birthdate: string;
  password: string;
}

interface IRoutes {
  users: { router: express.Router };
}

interface IPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}
