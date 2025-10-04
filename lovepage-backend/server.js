const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const app = express();

// Configuración de la base de datos local
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'lovepage'
};

// Cambia CORS para permitir el acceso desde tu frontend local
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      'http://localhost:5500'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(session({
  secret: 'lovepage_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Inicializa la tabla de usuarios si no existe
async function createTable() {
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL
    )
  `);
  await conn.end();
}
createTable();

// Registro de usuario
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

// Login y sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    await conn.end();
    if (rows.length) {
      req.session.user = { id: rows[0].id, username: rows[0].username };
      res.json({ success: true, user: req.session.user });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Revisar sesión
app.get('/session', (req, res) => {
  if (req.session.user) {
    res.json({ logged: true, user: req.session.user });
  } else {
    res.json({ logged: false });
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));