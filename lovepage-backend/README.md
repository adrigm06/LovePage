# 🔧 LovePage Backend

Backend del proyecto LovePage construido con Node.js, Express y MySQL. Proporciona autenticación de usuarios, gestión de mensajes personalizados, recordatorios y configuraciones.

## 📋 Características

### 🔐 Autenticación y Sesiones
- Sistema de registro y login de usuarios
- Gestión de sesiones con express-session
- Verificación de sesión activa

### 📊 Gestión de Datos
- **Mensajes Personalizados:** CRUD de mensajes por usuario
- **Recordatorios:** Gestión de fechas importantes con iconos personalizables
- **Fecha Especial:** Configuración de fecha de inicio de relación
- **Playlist de Spotify:** Almacenamiento de URL de playlist personalizada

### 🗄️ Base de Datos
- MySQL con tablas:
  - `users` - Información de usuarios y configuraciones
  - `messages` - Mensajes personalizados por usuario
  - `reminders` - Recordatorios de fechas importantes
- Creación automática de tablas al iniciar el servidor

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Este proyecto utiliza variables de entorno para proteger información sensible.

**Crear archivo `.env`:**

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=tu_usuario_de_base_de_datos
DB_PASSWORD=tu_contraseña_de_base_de_datos
DB_NAME=lovepage
DB_PORT=3306

# Configuración del Servidor
PORT=4000

# Seguridad (cambiar en producción)
SESSION_SECRET=cambia_esto_por_algo_muy_seguro_y_aleatorio
```

**Ejemplo de `.env.example`:**

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=lovepage
DB_PORT=3306
PORT=4000
SESSION_SECRET=your_secret_key_here
```

### 3. Configurar Base de Datos

**Opción A: Importar el schema SQL**
```bash
mysql -u tu_usuario -p lovepage < LovePage.sql
```

**Opción B: Dejar que el servidor cree las tablas**
El servidor creará automáticamente las tablas necesarias al iniciarse por primera vez.

### 4. Iniciar el Servidor

```bash
node server.js
```

El servidor estará disponible en `http://localhost:4000`

## 📡 API Endpoints

### Autenticación

#### `POST /register`
Registrar un nuevo usuario.

**Body:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Respuesta exitosa:**
```json
{
  "success": true
}
```

#### `POST /login`
Iniciar sesión.

**Body:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "usuario",
    "special_date": "2024-08-22",
    "spotify_playlist": "https://open.spotify.com/playlist/..."
  }
}
```

#### `GET /session`
Verificar si hay sesión activa.

**Respuesta:**
```json
{
  "logged": true,
  "user": {
    "id": 1,
    "username": "usuario",
    "special_date": "2024-08-22",
    "spotify_playlist": "https://..."
  }
}
```

#### `POST /logout`
Cerrar sesión.

**Respuesta:**
```json
{
  "success": true
}
```

### Mensajes

#### `GET /messages`
Obtener mensajes del usuario autenticado.

**Respuesta:**
```json
{
  "messages": [
    "Mensaje 1",
    "Mensaje 2",
    "Mensaje 3"
  ]
}
```

#### `POST /messages`
Guardar mensajes del usuario (reemplaza todos los existentes).

**Body:**
```json
{
  "messages": [
    "Nuevo mensaje 1",
    "Nuevo mensaje 2"
  ]
}
```

**Respuesta:**
```json
{
  "success": true
}
```

### Fecha Especial

#### `GET /special-date`
Obtener fecha especial del usuario.

**Respuesta:**
```json
{
  "special_date": "2024-08-22"
}
```

#### `POST /special-date`
Guardar fecha especial.

**Body:**
```json
{
  "special_date": "2024-08-22"
}
```

**Respuesta:**
```json
{
  "success": true,
  "special_date": "2024-08-22"
}
```

### Spotify

#### `GET /spotify-playlist`
Obtener URL de playlist de Spotify.

**Respuesta:**
```json
{
  "playlist": "https://open.spotify.com/playlist/..."
}
```

#### `POST /spotify-playlist`
Guardar URL de playlist.

**Body:**
```json
{
  "playlist": "https://open.spotify.com/playlist/..."
}
```

**Respuesta:**
```json
{
  "success": true,
  "playlist": "https://..."
}
```

### Recordatorios

#### `GET /reminders`
Obtener recordatorios del usuario.

**Respuesta:**
```json
{
  "reminders": [
    {
      "id": 1,
      "reminder_code": "cumpleanos",
      "name": "Cumpleaños",
      "date": "2025-05-15",
      "icon": "🎂"
    }
  ]
}
```

#### `POST /reminders`
Crear o actualizar recordatorio.

**Body:**
```json
{
  "reminder_code": "aniversario",
  "name": "Aniversario",
  "date": "2025-08-22",
  "icon": "💕"
}
```

**Respuesta:**
```json
{
  "success": true,
  "reminder": { /* datos del recordatorio */ }
}
```

## 📁 Estructura de Archivos

```
lovepage-backend/
├── server.js              # Servidor principal y rutas de autenticación
├── reminders-backend.js   # Router de recordatorios
├── dbConfig.js           # Configuración de conexión a BD
├── LovePage.sql          # Schema de base de datos
├── package.json          # Dependencias y scripts
├── .env                  # Variables de entorno (no subir a Git)
├── .env.example          # Ejemplo de variables de entorno
└── README.md             # Este archivo
```

## 🔒 Seguridad

### ⚠️ Advertencias Importantes

1. **Variables de Entorno:**
   - Nunca subas el archivo `.env` a tu repositorio
   - Está incluido en `.gitignore` por seguridad
   - Comparte solo `.env.example` con valores de ejemplo

2. **Contraseñas:**
   - Actualmente las contraseñas se almacenan en texto plano (Futuro cambio)

3. **Sesiones:**
   - Las sesiones se almacenan en memoria (solo para desarrollo)
   - En producción usar un store persistente (Redis, MongoDB)

4. **CORS:**
   - Configurado para desarrollo en `http://localhost:5500`
   - Cambiar a tu dominio en producción

## 🗄️ Schema de Base de Datos

### Tabla `users`
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  special_date DATE NULL,
  spotify_playlist VARCHAR(255) DEFAULT NULL
);
```

### Tabla `messages`
```sql
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message_text TEXT NOT NULL,
  display_order INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabla `reminders`
```sql
CREATE TABLE reminders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reminder_code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  icon VARCHAR(10) DEFAULT '🎉',
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, reminder_code)
);
```

## 🔧 Configuración CORS

El servidor está configurado para aceptar peticiones desde:
- **Desarrollo:** `http://localhost:5500` (Live Server)
- **Credenciales:** Habilitadas para sesiones
- **Métodos:** GET, POST, PUT, OPTIONS

Para cambiar la configuración, edita `server.js`:

```javascript
app.use(cors({
  origin: 'http://tu-dominio.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS']
}));
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que MySQL esté corriendo
- Comprueba las credenciales en `.env`
- Asegúrate de que la base de datos `lovepage` exista

### Error: "Port 4000 already in use"
- Cambia el puerto en `.env`
- O detén el proceso que usa el puerto 4000

### Error de CORS
- Verifica que el frontend esté en `http://localhost:5500`
- Si usas otro puerto, actualiza la configuración CORS

### Las sesiones no persisten
- Normal en desarrollo (se usan sesiones en memoria)
- Se pierden al reiniciar el servidor
- En producción usar un store persistente

## 📦 Dependencias

```json
{
  "express": "^4.18.2",        // Framework web
  "mysql2": "^3.9.5",          // Cliente MySQL con Promises
  "body-parser": "^1.20.2",    // Parser de JSON
  "cors": "^2.8.5",            // Cross-Origin Resource Sharing
  "express-session": "^1.17.3", // Gestión de sesiones
  "dotenv": "^17.2.3"          // Variables de entorno
}
```

## 🚀 Despliegue en Producción

### Checklist Pre-Despliegue
- [ ] Implementar bcrypt para contraseñas
- [ ] Configurar HTTPS
- [ ] Usar store persistente para sesiones (Redis)
- [ ] Cambiar `SESSION_SECRET` a valor seguro
- [ ] Configurar CORS para dominio de producción
- [ ] Implementar rate limiting
- [ ] Configurar logging
- [ ] Backups automáticos de base de datos
- [ ] Variables de entorno en servidor
- [ ] Usar PM2 o similar para proceso

### Ejemplo con PM2

```bash
npm install -g pm2
pm2 start server.js --name lovepage-backend
pm2 save
pm2 startup
```

## 📚 Recursos Adicionales

- [Documentación del proyecto principal](../README.md)
- [Arquitectura modular del frontend](../scripts/README-MODULAR.md)

## 💡 Tips de Desarrollo

1. **Auto-reload:** Usa nodemon para desarrollo
   ```bash
   npm install -g nodemon
   nodemon server.js
   ```

2. **Testing de API:** Usa Postman o Thunder Client
   - Importa la colección de endpoints
   - No olvides habilitar cookies para sesiones

3. **Logs:** Revisa la consola del servidor para depuración
  - Los errores se muestran con stack trace
  - Las queries SQL se pueden registrar para depuración

---

**Autor:** [Adrigm06](https://github.com/adrigm06)  
**Última actualización:** Octubre 2025  