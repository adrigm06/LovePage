const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const remindersRouter = require('./reminders-backend.js');
const app = express();

app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS']
}));
app.options('*', cors());

app.use(bodyParser.json());
app.use(session({
  secret: 'lovepage_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(remindersRouter);

const dbConfig = require('./dbConfig');

async function createTables() {
  const conn = await mysql.createConnection(dbConfig);
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
  await conn.end();
}
createTables();

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

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
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

app.get('/session', async (req, res) => {
  if (req.session.user) {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT special_date, spotify_playlist FROM users WHERE id = ?', [req.session.user.id]);
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

app.get('/special-date', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute('SELECT special_date FROM users WHERE id = ?', [req.session.user.id]);
  await conn.end();
  if (rows.length) {
    res.json({ special_date: rows[0].special_date });
  } else {
    res.json({ special_date: null });
  }
});

app.post('/special-date', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const { special_date } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('UPDATE users SET special_date = ? WHERE id = ?', [special_date, req.session.user.id]);
  await conn.end();
  req.session.user.special_date = special_date;
  res.json({ success: true, special_date });
});

// Guardar y obtener playlist personalizada
app.post('/spotify-playlist', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const { playlist } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute('UPDATE users SET spotify_playlist = ? WHERE id = ?', [playlist, req.session.user.id]);
  await conn.end();
  req.session.user.spotify_playlist = playlist;
  res.json({ success: true, playlist });
});

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

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Obtener mensajes del usuario
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

// Guardar mensajes del usuario (reemplaza todos los mensajes existentes)
app.post('/messages', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No logueado" });
  const { messages } = req.body;
  
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "El formato de mensajes debe ser un array" });
  }
  
  const conn = await mysql.createConnection(dbConfig);
  
  try {
    // Eliminar mensajes existentes del usuario
    await conn.execute('DELETE FROM messages WHERE user_id = ?', [req.session.user.id]);
    
    // Insertar nuevos mensajes
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].trim()) { // Solo insertar si el mensaje no está vacío
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

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));