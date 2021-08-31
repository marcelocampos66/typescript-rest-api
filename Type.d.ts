interface IUserData {
  email: string;
  name: string;
  birthdate: string;
  password: string;
}

interface IRoutes {
  users: { router: express.Router };
}
