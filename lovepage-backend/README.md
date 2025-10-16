# LovePage Backend

## Configuración

### Variables de Entorno

Este proyecto utiliza variables de entorno para proteger información sensible. 

1. Copia el archivo `.env.example` y renómbralo a `.env`:

2. Edita el archivo `.env` con tus credenciales reales:

   DB_HOST=localhost
   DB_USER=tu_usuario_de_base_de_datos
   DB_PASSWORD=tu_contraseña_de_base_de_datos
   DB_NAME=lovepage
   DB_PORT=3306

### Instalación

npm install

### Ejecución

node server.js

## Seguridad

⚠️ **IMPORTANTE**: Nunca subas el archivo `.env` a tu repositorio. Este archivo contiene información sensible y está incluido en `.gitignore`.
