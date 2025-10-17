// Cargar variables de entorno
require('dotenv').config();

// Esta nueva configuración es más robusta y compatible con Render.
// Primero intenta usar la URL completa de la base de datos (DATABASE_URL).
// Si no existe (para desarrollo local), usa las variables individuales del archivo .env.

module.exports = process.env.DATABASE_URL 
  ? { uri: process.env.DATABASE_URL }
  : {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'lovepage',
      port: process.env.DB_PORT || 3306
    };