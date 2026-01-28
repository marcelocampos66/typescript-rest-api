import winston from 'winston';
import { APP_ENV } from './env';
import { Logger } from '../../core/protocols/logger';

class AppLogger implements Logger {
  private readonly logger = winston.createLogger({
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

  public info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  public error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }
}

export default new AppLogger();
