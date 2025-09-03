/**
 * app.js
 *
 * Construye y configura la aplicación Express (middlewares, seguridad, rutas y manejo de errores).
 * No levanta el servidor HTTP (eso lo hace server.js).
 *
 * Puntos clave:
 * - Seguridad básica: Helmet, CORS, HPP, Rate Limiting.
 * - Parseo JSON con límite de tamaño.
 * - Logging HTTP.
 * - Rutas versionadas bajo /v1.
 * - Manejo de errores de validación (Celebrate/Joi) y un handler de errores final.
 */

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

/**
 * Crea y retorna una instancia configurada de Express.
 *
 * @returns {import('express').Express} Instancia de la app Express lista para usar en server.js
 */
export function createApp() {
  const app = express();

  // ─────────────────────────────────────────────────────────────────────────────
  // Middlewares de seguridad y utilitarios (orden recomendado)
  // ─────────────────────────────────────────────────────────────────────────────

  // Helmet: añade cabeceras de seguridad (CSP, HSTS, XSS, etc.)
  app.use(helmet());

  // CORS: controla orígenes permitidos para requests del front.
  // Lee una lista separada por comas desde env.CORS_ORIGINS (puede estar vacía).
  app.use(cors({ origin: env.CORS_ORIGINS ? env.CORS_ORIGINS.split(',') : [] }));

  // HPP: evita contaminación de parámetros HTTP (HTTP Parameter Pollution).
  app.use(hpp());

  // Body parser: acepta JSON con límite para evitar payloads excesivos.
  app.use(express.json({ limit: '1mb' }));

  // Logging HTTP (accesos). Útil para auditoría y debugging.
  app.use(httpLogger);

  // Rate limit global: protege de abusos limitando requests por ventana de tiempo.
  // windowMs y max vienen de variables de entorno para poder ajustarlos por ambiente.
  app.use(rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true, // expone RateLimit-* headers estándar
    legacyHeaders: false,  // desactiva X-RateLimit-* headers antiguos
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // Rutas (siempre versionadas para facilitar breaking changes controlados)
  // ─────────────────────────────────────────────────────────────────────────────

  // Endpoints de salud/observabilidad (health, liveness, readiness)
  app.use('/v1', healthRouter);

  // Autenticación: registro, login, refresh, logout
  app.use('/v1/auth', authRouter);

  // Gestión de usuarios del tenant: /me, update profile, listado admin, etc.
  app.use('/v1/users', usersRouter);

  // ─────────────────────────────────────────────────────────────────────────────
  // Manejo de errores
  // ─────────────────────────────────────────────────────────────────────────────

  // Errores de validación (Celebrate/Joi):
  // Si alguna ruta con celebrate(...) falla la validación, cae aquí con 400.
  app.use(celebrateErrors());

  // Handler de errores final (catch-all):
  // Mapea errores de negocio a códigos HTTP; cualquier cosa no controlada => 500.
  // Importante: mantener mensajes neutrales para no filtrar detalles sensibles.
  app.use((err, req, res, _next) => {
    console.error(err);

    // Mapeo simple por mensaje (convención interna). Ajusta según tus necesidades.
    const code =
      err.message === 'INVALID_CREDENTIALS' ? 401 :
      err.message === 'INVALID_REFRESH'     ? 401 :
      err.message === 'REUSED_REFRESH'      ? 401 :
      err.message === 'NOT_FOUND'           ? 404 :
      500;

    res.status(code).json({ message: err.message || 'Internal error' });
  });

  return app;
}

