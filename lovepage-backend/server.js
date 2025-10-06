const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const remindersRouter = require('./reminders-backend.js');
const app = express();

// CORS: DEBE ir antes de cualquier middleware/ruta
app.use(cors({
  origin: 'http://localhost:5500', // Cambia si usas otro puerto/frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS']
}));

// Permitir preflight OPTIONS (necesario para POST/PUT con credentials)
app.options('*', cors());

// Middlewares
app.use(bodyParser.json());
app.use(session({
  secret: 'lovepage_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Solo para desarrollo/localhost
}));

app.use(remindersRouter);

const dbConfig = require('./dbConfig');

// Crear tabla users si no existe
async function createTable() {
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      special_date DATE NULL
    )
  `);
  await conn.end();
}
createTable();

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
      req.session.user = { id: rows[0].id, username: rows[0].username, special_date: rows[0].special_date };
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
    const [rows] = await conn.execute('SELECT special_date FROM users WHERE id = ?', [req.session.user.id]);
    await conn.end();
    if (rows.length) req.session.user.special_date = rows[0].special_date;
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

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));