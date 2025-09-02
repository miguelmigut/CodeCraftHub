// src/config/env.js
import 'dotenv/config';

// Valores con fallback por si no existen en .env
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/usersvc',
  MONGO_DB: process.env.MONGO_DB || 'usersvc',

  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL || '10m',
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL || '7d',
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY || '',
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || '',

  CORS_ORIGINS: process.env.CORS_ORIGINS || '',
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 60000,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 200,
};
