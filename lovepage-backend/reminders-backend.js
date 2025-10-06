const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = require('./dbConfig');

function getUserId(req) {
  if (req.session && req.session.user && req.session.user.id) {
    return req.session.user.id;
  }
  return null;
}

// Obtener recordatorios personalizados del usuario
router.get('/reminders', async (req, res) => {
  const user_id = getUserId(req);
  if (!user_id) return res.status(401).json({error: "No autenticado"});
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute('SELECT * FROM reminders WHERE user_id=?', [user_id]);
  await conn.end();
  res.json({reminders: rows});
});

// Guardar/actualizar un recordatorio
router.post('/reminders', async (req, res) => {
  const user_id = getUserId(req);
  if (!user_id) return res.status(401).json({error: "No autenticado"});
  const { reminder_code, name, date, icon } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  // Busca por reminder_code, NO por name
  const [rows] = await conn.execute('SELECT id FROM reminders WHERE user_id=? AND reminder_code=?', [user_id, reminder_code]);
  if (rows.length) {
    // Actualiza
    await conn.execute('UPDATE reminders SET name=?, date=?, icon=? WHERE user_id=? AND reminder_code=?', [name, date, icon, user_id, reminder_code]);
  } else {
    // Inserta
    await conn.execute('INSERT INTO reminders (user_id, reminder_code, name, date, icon) VALUES (?, ?, ?, ?, ?)', [user_id, reminder_code, name, date, icon]);
  }
  await conn.end();
  res.json({success: true});
});

module.exports = router;