import winston from 'winston';
import { APP_ENV } from './env';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        APP_ENV === "production" ? winston.format.json() : winston.format.prettyPrint({ colorize: true })
      ),
    }),
  ],
});

export default logger;
