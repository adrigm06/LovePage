/* ============================================
    Backend - LovePage (Adaptado a PostgreSQL para Render)
    Contenido: Configuración y rutas del backend
   ============================================ */
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const remindersRouter = require('./reminders-backend.js');
const app = express();

console.log("Iniciando servidor en modo:", process.env.NODE_ENV);

// Configuración de la base de datos
const dbConfig = require('./dbConfig');
const pool = new Pool(dbConfig);

// Lista de orígenes permitidos
const allowedOrigins = ['http://localhost:5500', 'https://adrigm06.github.io'];

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
app.use(session({
  secret: 'una-frase-secreta-muy-larga-y-dificil-de-adivinar',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: { 
    secure: true,
    httpOnly: true,
    sameSite: 'none'
  } 
}));

console.log("Middlewares configurados.");

// Montar el router de recordatorios
app.use(remindersRouter);

// Función para crear tablas si no existen
async function createTables() {
  const client = await pool.connect();
  try {
    console.log("Conectado a PostgreSQL. Verificando/creando tablas...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        special_date DATE,
        spotify_playlist VARCHAR(255)
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS reminders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        reminder_code VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        icon VARCHAR(10) DEFAULT '🎉',
        UNIQUE(user_id, reminder_code)
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message_text TEXT NOT NULL,
        display_order INTEGER NOT NULL
      );
    `);
    console.log("Tablas verificadas/creadas correctamente.");
  } catch (err) {
    console.error("Error al crear las tablas:", err);
  } finally {
    client.release();
  }
}
createTables();

// --- RUTAS DE LA API ---

// POST /register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(400).json({ error: "El usuario ya existe." });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT id, username, TO_CHAR(special_date, \'YYYY-MM-DD\') as special_date, spotify_playlist FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      req.session.user = result.rows[0];
      req.session.save(err => {
        if (err) {
          console.error("Error al guardar la sesión:", err);
          return res.status(500).json({ error: "No se pudo guardar la sesión." });
        }
        res.json({ success: true, user: req.session.user });
      });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (err) {
    console.error("ERROR CRÍTICO en /login:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// GET /session
app.get('/session', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ logged: true, user: req.session.user });
  } else {
    res.json({ logged: false });
  }
});

// POST /logout
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: "No se pudo cerrar la sesión." });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// POST /special-date
app.post('/special-date', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "No logueado" });
    const { special_date } = req.body;
    try {
        await pool.query('UPDATE users SET special_date = $1 WHERE id = $2', [special_date, req.session.user.id]);
        req.session.user.special_date = special_date;
        res.json({ success: true, special_date });
    } catch (err) {
        console.error("Error en /special-date:", err);
        res.status(500).json({ error: "Error al guardar la fecha." });
    }
});

// GET /spotify-playlist y POST /spotify-playlist
app.route('/spotify-playlist')
    .get(async (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: "No logueado" });
        try {
            const result = await pool.query('SELECT spotify_playlist FROM users WHERE id = $1', [req.session.user.id]);
            res.json({ playlist: result.rows.length ? result.rows[0].spotify_playlist : null });
        } catch (err) {
            res.status(500).json({ error: "Error del servidor." });
        }
    })
    .post(async (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: "No logueado" });
        const { playlist } = req.body;
        try {
            await pool.query('UPDATE users SET spotify_playlist = $1 WHERE id = $2', [playlist, req.session.user.id]);
            req.session.user.spotify_playlist = playlist;
            res.json({ success: true, playlist });
        } catch (err) {
            res.status(500).json({ error: "Error al guardar la playlist." });
        }
    });

// GET /messages y POST /messages
app.route('/messages')
    .get(async (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: "No logueado" });
        try {
            const result = await pool.query('SELECT message_text FROM messages WHERE user_id = $1 ORDER BY display_order ASC', [req.session.user.id]);
            res.json({ messages: result.rows.map(row => row.message_text) });
        } catch (err) {
            res.status(500).json({ error: "Error del servidor." });
        }
    })
    .post(async (req, res) => {
        if (!req.session.user) return res.status(401).json({ error: "No logueado" });
        const { messages } = req.body;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM messages WHERE user_id = $1', [req.session.user.id]);
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].trim()) {
                    await client.query('INSERT INTO messages (user_id, message_text, display_order) VALUES ($1, $2, $3)', [req.session.user.id, messages[i].trim(), i]);
                }
            }
            await client.query('COMMIT');
            res.json({ success: true });
        } catch (err) {
            await client.query('ROLLBACK');
            res.status(500).json({ error: "Error al guardar mensajes." });
        } finally {
            client.release();
        }
    });

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend de LovePage (PostgreSQL) escuchando en puerto ${PORT}`));