import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { errors as celebrateErrors } from 'celebrate';
import { env } from './config/env.js';
import { httpLogger } from './utils/logger.js';
import { authRouter } from './routes/auth.routes.js';
import { usersRouter } from './routes/users.routes.js';
import { healthRouter } from './routes/health.routes.js';

export function createApp() {
  const app = express();

  // Seguridad y básicos
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS ? env.CORS_ORIGINS.split(',') : [] }));
  app.use(hpp());
  app.use(express.json({ limit: '1mb' }));
  app.use(httpLogger);

  // Rate limit global
  app.use(rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false
  }));

  // Rutas
  app.use('/v1', healthRouter);
  app.use('/v1/auth', authRouter);
  app.use('/v1/users', usersRouter);

  // Errores de validación
  app.use(celebrateErrors());

  // Handler de errores final
  app.use((err, req, res, _next) => {
    console.error(err);
    const code = err.message === 'INVALID_CREDENTIALS' ? 401
              : err.message === 'INVALID_REFRESH' ? 401
              : err.message === 'REUSED_REFRESH' ? 401
              : err.message === 'NOT_FOUND' ? 404
              : 500;
    res.status(code).json({ message: err.message || 'Internal error' });
  });

  return app;
}
