/* ============================================
    Backend - LovePage (Versión Corregida y Mejorada)
    Contenido: Configuración y rutas del backend con logging de errores
   ============================================ */

const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const remindersRouter = require('./reminders-backend.js');
const app = express();

console.log("Iniciando servidor...");

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:5500',
  'https://adrigm06.github.io'
];

// Configuración CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por la política de CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS']
}));

app.options('*', cors());

// Middlewares
app.use(bodyParser.json());

// Configuración de Sesiones para Producción
app.use(session({
  secret: 'una-frase-secreta-muy-larga-y-dificil-de-adivinar',
  resave: false,
  saveUninitialized: false,
  proxy: true, // Necesario si estás detrás de un proxy como en Render
  cookie: { 
    secure: true,
    httpOnly: true,
    sameSite: 'none'
  } 
}));

console.log("Middlewares configurados.");

// Monta el router de recordatorios
app.use(remindersRouter);

// Configuración de la base de datos
const dbConfig = require('./dbConfig');

// Función para crear tablas si no existen
async function createTables() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log("Conectado a la base de datos. Creando tablas si es necesario...");
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        special_date DATE NULL,
        spotify_playlist VARCHAR(255) DEFAULT NULL
      )
    `);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS reminders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        reminder_code VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        icon VARCHAR(10) DEFAULT '🎉',
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, reminder_code)
      )
    `);
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message_text TEXT NOT NULL,
        display_order INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("Tablas verificadas/creadas correctamente.");
    await conn.end();
  } catch (err) {
    console.error("Error al crear las tablas:", err);
  }
}
createTables();

// --- RUTAS DE LA API CON LOGGING DE ERRORES ---

// POST /register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Intento de registro para el usuario: ${username}`);
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    await conn.end();
    console.log(`Usuario ${username} registrado con éxito.`);
    res.json({ success: true });
  } catch (err) {
    console.error("Error en /register:", err.message);
    res.status(400).json({ error: "El usuario ya existe o hay un problema con la base de datos." });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Intento de login para el usuario: ${username}`);
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT id, username, DATE_FORMAT(special_date, "%Y-%m-%d") as special_date, spotify_playlist FROM users WHERE username = ? AND password = ?', [username, password]);
    await conn.end();
    
    if (rows.length > 0) {
      console.log(`Login exitoso para ${username}. Creando sesión.`);
      req.session.user = { 
        id: rows[0].id, 
        username: rows[0].username, 
        special_date: rows[0].special_date, 
        spotify_playlist: rows[0].spotify_playlist 
      };
      // Guardar la sesión antes de enviar la respuesta
      req.session.save((err) => {
        if (err) {
          console.error("Error al guardar la sesión:", err);
          return res.status(500).json({ error: "No se pudo guardar la sesión." });
        }
        res.json({ success: true, user: req.session.user });
      });
    } else {
      console.warn(`Credenciales incorrectas para el usuario: ${username}`);
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (err) {
    // Este es el error que estabas viendo (500)
    console.error("ERROR CRÍTICO en /login:", err);
    res.status(500).json({ error: "Error interno del servidor. Revisa los logs." });
  }
});

// GET /session
app.get('/session', async (req, res) => {
    if (req.session && req.session.user) {
      console.log(`Sesión activa encontrada para: ${req.session.user.username}`);
      try {
          const conn = await mysql.createConnection(dbConfig);
          const [rows] = await conn.execute('SELECT DATE_FORMAT(special_date, "%Y-%m-%d") as special_date, spotify_playlist FROM users WHERE id = ?', [req.session.user.id]);
          await conn.end();
          if (rows.length) {
              // Actualiza la sesión con la información más reciente de la DB
              req.session.user.special_date = rows[0].special_date;
              req.session.user.spotify_playlist = rows[0].spotify_playlist;
          }
          res.json({ logged: true, user: req.session.user });
      } catch (err) {
          console.error("Error al refrescar datos de sesión desde la DB:", err);
          res.status(500).json({ error: "Error interno del servidor." });
      }
    } else {
      console.log("No se encontró sesión activa.");
      res.json({ logged: false });
    }
});

// POST /logout
app.post('/logout', (req, res) => {
  if (req.session.user) {
    console.log(`Cerrando sesión para ${req.session.user.username}`);
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al destruir la sesión:", err);
        return res.status(500).json({ error: "No se pudo cerrar la sesión." });
      }
      res.clearCookie('connect.sid'); // Limpia la cookie del navegador
      res.json({ success: true });
    });
  } else {
    res.json({ success: true });
  }
});


// GET /special-date
app.get('/special-date', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute('SELECT DATE_FORMAT(special_date, "%Y-%m-%d") as special_date FROM users WHERE id = ?', [req.session.user.id]);
  await conn.end();
  if (rows.length && rows[0].special_date) {
    res.json({ special_date: rows[0].special_date });
  } else {
    res.json({ special_date: null });
  }
});


// POST /special-date
app.post('/special-date', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const { special_date } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('UPDATE users SET special_date = ? WHERE id = ?', [special_date, req.session.user.id]);
  await conn.end();
  req.session.user.special_date = special_date;
  res.json({ success: true, special_date });
});

// POST /spotify-playlist
app.post('/spotify-playlist', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const { playlist } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('UPDATE users SET spotify_playlist = ? WHERE id = ?', [playlist, req.session.user.id]);
  await conn.end();
  req.session.user.spotify_playlist = playlist;
  res.json({ success: true, playlist });
});

// GET /spotify-playlist
app.get('/spotify-playlist', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute('SELECT spotify_playlist FROM users WHERE id = ?', [req.session.user.id]);
  await conn.end();
  if (rows.length) {
    res.json({ playlist: rows[0].spotify_playlist });
  } else {
    res.json({ playlist: null });
  }
});

// GET /messages
app.get('/messages', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute(
    'SELECT message_text FROM messages WHERE user_id = ? ORDER BY display_order ASC',
    [req.session.user.id]
  );
  await conn.end();
  const messages = rows.map(row => row.message_text);
  res.json({ messages });
});

// POST /messages
app.post('/messages', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const { messages } = req.body;
  
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "El formato de mensajes debe ser un array" });
  }
  
  const conn = await mysql.createConnection(dbConfig);
  
  try {
    await conn.execute('DELETE FROM messages WHERE user_id = ?', [req.session.user.id]);
    
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].trim()) {
        await conn.execute(
          'INSERT INTO messages (user_id, message_text, display_order) VALUES (?, ?, ?)',
          [req.session.user.id, messages[i].trim(), i]
        );
      }
    }
    
    await conn.end();
    res.json({ success: true });
  } catch (err) {
    await conn.end();
    res.status(500).json({ error: "Error al guardar mensajes" });
  }
});

// Cargar variables de entorno si no se ha hecho ya
if (!process.env.DB_HOST) {
  require('dotenv').config();
}

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));