/**
 * db.js
 *
 * Módulo encargado de la conexión a la base de datos MongoDB usando Mongoose.
 *
 * - Define parámetros de conexión (URI, nombre de la DB, pool de conexiones, timeouts).
 * - Expone la función `connectDB()` para ser llamada desde server.js al arrancar el servicio.
 *
 * Beneficio: centralizamos la lógica de conexión a la base de datos en un solo archivo.
 */

import mongoose from 'mongoose';
import { env } from './env.js';

/**
 * Conecta a MongoDB utilizando Mongoose.
 *
 * @returns {Promise<void>} Promesa que se resuelve cuando la conexión es exitosa.
 * @throws {Error} Si la conexión falla (ej. credenciales incorrectas, host no accesible).
 */
export async function connectDB() {
  // Habilita el modo strictQuery para que Mongoose valide
  // que solo se usen campos definidos en el schema al hacer queries.
  mongoose.set('strictQuery', true);

  // Inicia conexión a MongoDB con opciones recomendadas
  await mongoose.connect(env.MONGO_URI, {
    // Nombre de la base de datos a usar
    dbName: env.MONGO_DB,

    // Número máximo de conexiones en el pool (controla concurrencia)
    maxPoolSize: 10,

    // Tiempo máximo que Mongoose intentará seleccionar un servidor
    // antes de dar error (10 segundos por defecto aquí)
    serverSelectionTimeoutMS: 10000,

    // Tiempo máximo que una operación puede permanecer abierta
    // en el socket antes de cerrarse (45 segundos aquí)
    socketTimeoutMS: 45000,

    // Permite reintentar escrituras en caso de fallo de red transitorio
    retryWrites: true,
  });

  // Log para confirmar la conexión
  console.log('[db] connected');
}
