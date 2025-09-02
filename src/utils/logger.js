import morgan from 'morgan';
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console({ format: winston.format.json() })],
});

export const httpLogger = morgan('combined');
