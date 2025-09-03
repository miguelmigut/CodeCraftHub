/**
 * env.js
 *
 * Carga y centraliza las variables de entorno de la aplicación.
 * 
 * - Se utiliza la librería dotenv para leer el archivo `.env` en la raíz del proyecto.
 * - Todas las variables importantes se exponen en un objeto `env` que será usado 
 *   en cualquier parte del código (server.js, db.js, servicios, etc.).
 * - Cada propiedad tiene un valor por defecto en caso de que no exista en el `.env`.
 *
 * Beneficios:
 * - Mantiene la configuración en un solo lugar.
 * - Permite cambiar comportamiento de la app sin modificar el código (solo editando `.env`).
 */

import 'dotenv/config'; // Carga automáticamente las variables definidas en el archivo .env

/**
 * Objeto central de configuración.
 * Todas las claves están documentadas para claridad.
 */
export const env = {
  // Entorno de ejecución: development | production | test
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Puerto en el que el servidor escuchará (ej. 3000 en local, 5000 en la nube)
  PORT: process.env.PORT || 3000,

  // URI de conexión a MongoDB (con credenciales incluidas si aplica)
  // Ejemplo: mongodb://user:pass@host:27017/usermngtservice?authSource=admin
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/usermngtservice',

  // Nombre de la base de datos a usar dentro de MongoDB
  MONGO_DB: process.env.MONGO_DB || 'usermngtservice',

  // Tiempo de vida (TTL) del token de acceso JWT (ej. "10m" = 10 minutos)
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL || '10m',

  // Tiempo de vida del token de refresco JWT (ej. "7d" = 7 días)
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL || '7d',

  // Claves para firmar y verificar JWT con algoritmo RS256
  // NOTA: estas claves deben configurarse en el .env con saltos de línea escapados (\n)
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY || '',
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || '',

  // Lista de orígenes permitidos para CORS (separados por coma)
  // Ejemplo: "http://localhost:5173,https://miapp.com"
  CORS_ORIGINS: process.env.CORS_ORIGINS || '',

  // Configuración global del rate limiter:
  // - RATE_LIMIT_WINDOW_MS: ventana de tiempo en milisegundos (default 60s).
  // - RATE_LIMIT_MAX: número máximo de requests por IP en esa ventana.
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 60000,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 200,
};

