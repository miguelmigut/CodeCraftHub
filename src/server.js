/**
 * server.js
 *
 * Punto de entrada de la aplicación User Management Service.
 * - Conecta a la base de datos MongoDB.
 * - Crea la aplicación Express ya configurada (desde app.js).
 * - Inicia el servidor HTTP en el puerto configurado.
 *
 * La lógica de configuración de la app y de la DB se mantiene en módulos separados,
 * manteniendo este archivo limpio y fácil de leer.
 */

import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

/**
 * Función principal de arranque del servicio.
 * Maneja el orden de inicialización:
 * 1. Conexión a la base de datos.
 * 2. Creación de la instancia de Express.
 * 3. Arranque del servidor HTTP en el puerto configurado.
 */
async function start() {
  // 1. Conectar a MongoDB
  await connectDB();

  // 2. Crear la app Express (con middlewares, rutas y errores configurados)
  const app = createApp();

  // 3. Iniciar servidor HTTP escuchando en el puerto definido en .env
  app.listen(env.PORT, () => {
    console.log(`[user-svc] listening on :${env.PORT}`);
  });
}

// Ejecuta la función start() y captura errores fatales de arranque.
// Ejemplos: fallo al conectar a DB, fallo al inicializar app.
start().catch((e) => {
  console.error('Fatal start error', e);
  process.exit(1); // Salida con código 1: indica error al sistema operativo
});
