/* ============================================
    Backend - LovePage
    Contenido: Configuración y rutas del backend
   ============================================ */

const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const remindersRouter = require('./reminders-backend.js');
const app = express();

// Lista de orígenes permitidos. GitHub Pages puede usar varias URLs.
const allowedOrigins = [
  'http://localhost:5500', // Para desarrollo local
  'https://adrigm06.github.io' // Tu URL de GitHub Pages
];

// Configuración CORS mejorada
app.use(cors({
  origin: function (origin, callback) {
    // Permite peticiones sin 'origin' (como las de Postman o apps móviles) y las de nuestra lista.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por la política de CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS']
}));

// Responder a las peticiones pre-vuelo (pre-flight) para todos los endpoints
app.options('*', cors());

// Middlewares
app.use(bodyParser.json());
app.use(session({
  secret: 'lovepage_secret_production', // Cambia esto por una frase secreta más segura
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: true, // Debe ser true si tu backend está en HTTPS (Render lo está)
    httpOnly: true,
    sameSite: 'none' // Necesario para peticiones cross-site con cookies
  } 
}));

// Monta el router que gestiona los recordatorios personalizados
app.use(remindersRouter);

// Configuración de conexión a la base de datos
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

// --- RUTAS DE LA API ---

// Post /register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const conn = await mysql.createConnection(dbConfig);
    await conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    await conn.end();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Usuario ya existe" });
  }
});

// Post /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT id, username, DATE_FORMAT(special_date, "%Y-%m-%d") as special_date, spotify_playlist FROM users WHERE username = ? AND password = ?', [username, password]);
    await conn.end();
    if (rows.length) {
      req.session.user = { id: rows[0].id, username: rows[0].username, special_date: rows[0].special_date, spotify_playlist: rows[0].spotify_playlist };
      res.json({ success: true, user: req.session.user });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Get /session
app.get('/session', async (req, res) => {
  if (req.session.user) {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT DATE_FORMAT(special_date, "%Y-%m-%d") as special_date, spotify_playlist FROM users WHERE id = ?', [req.session.user.id]);
    await conn.end();
    if (rows.length) {
      req.session.user.special_date = rows[0].special_date;
      req.session.user.spotify_playlist = rows[0].spotify_playlist;
    }
    res.json({ logged: true, user: req.session.user });
  } else {
    res.json({ logged: false });
  }
});

// Post /logout
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Get /messages
app.get('/messages', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute('SELECT message_text FROM messages WHERE user_id = ? ORDER BY display_order ASC', [req.session.user.id]);
  await conn.end();
  const messages = rows.map(row => row.message_text);
  res.json({ messages });
});

// Post /messages
app.post('/messages', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const { messages } = req.body;
  if (!Array.isArray(messages)) return res.status(400).json({ error: "El formato debe ser un array" });
  
  const conn = await mysql.createConnection(dbConfig);
  try {
    await conn.execute('DELETE FROM messages WHERE user_id = ?', [req.session.user.id]);
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].trim()) {
        await conn.execute('INSERT INTO messages (user_id, message_text, display_order) VALUES (?, ?, ?)', [req.session.user.id, messages[i].trim(), i]);
      }
    }
    await conn.end();
    res.json({ success: true });
  } catch (err) {
    await conn.end();
    res.status(500).json({ error: "Error al guardar mensajes" });
  }
});


// Post /special-date
app.post('/special-date', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const { special_date } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('UPDATE users SET special_date = ? WHERE id = ?', [special_date, req.session.user.id]);
  await conn.end();
  req.session.user.special_date = special_date;
  res.json({ success: true, special_date });
});


// Post /spotify-playlist
app.post('/spotify-playlist', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const { playlist } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('UPDATE users SET spotify_playlist = ? WHERE id = ?', [playlist, req.session.user.id]);
  await conn.end();
  req.session.user.spotify_playlist = playlist;
  res.json({ success: true, playlist });
});

// Get /spotify-playlist
app.get('/spotify-playlist', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute('SELECT spotify_playlist FROM users WHERE id = ?', [req.session.user.id]);
  await conn.end();
  res.json({ playlist: rows.length ? rows[0].spotify_playlist : null });
});


// Cargar variables de entorno si no se ha hecho ya
if (!process.env.DB_HOST) {
  require('dotenv').config();
}

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));