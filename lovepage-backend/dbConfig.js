// Cargar variables de entorno
require('dotenv').config();

// Configuración para PostgreSQL
// Usa la variable DATABASE_URL para producción en Render.
// Para desarrollo local, construye la URL desde las variables del .env.
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

module.exports = {
  connectionString: connectionString,
  // Añade esta configuración para Render, que requiere conexiones SSL.
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};