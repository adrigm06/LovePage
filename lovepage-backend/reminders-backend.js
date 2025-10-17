/* ============================================
  Backend - LovePage
  Contenido: Router de recordatorios personalizados (Adaptado a PostgreSQL)
   ============================================ */
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dbConfig = require('./dbConfig');

const pool = new Pool(dbConfig);

function getUserId(req) {
  if (req.session && req.session.user && req.session.user.id) {
    return req.session.user.id;
  }
  return null;
}

// GET /reminders
router.get('/reminders', async (req, res) => {
  const user_id = getUserId(req);
  if (!user_id) return res.status(401).json({ error: "No autenticado" });
  try {
    const result = await pool.query('SELECT * FROM reminders WHERE user_id = $1', [user_id]);
    res.json({ reminders: result.rows });
  } catch (err) {
    console.error("Error en GET /reminders:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// POST /reminders
router.post('/reminders', async (req, res) => {
  const user_id = getUserId(req);
  if (!user_id) return res.status(401).json({ error: "No autenticado" });
  const { reminder_code, name, date, icon } = req.body;

  try {
    const existing = await pool.query('SELECT id FROM reminders WHERE user_id = $1 AND reminder_code = $2', [user_id, reminder_code]);
    if (existing.rows.length > 0) {
      await pool.query('UPDATE reminders SET name = $1, date = $2, icon = $3 WHERE user_id = $4 AND reminder_code = $5', [name, date, icon, user_id, reminder_code]);
    } else {
      await pool.query('INSERT INTO reminders (user_id, reminder_code, name, date, icon) VALUES ($1, $2, $3, $4, $5)', [user_id, reminder_code, name, date, icon]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error en POST /reminders:", err);
    res.status(500).json({ error: "Error al guardar el recordatorio" });
  }
});

module.exports = router;