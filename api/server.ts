import App from './App';
import controllers from '../controllers/controllers';

const { PORT } = process.env;

const server = new App(PORT, controllers);

server.startServer();
