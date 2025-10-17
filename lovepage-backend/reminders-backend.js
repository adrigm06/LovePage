/* ============================================
  Backend - LovePage
  Contenido: Router de recordatorios personalizados
   ============================================ */

// - Configura router para endpoints de recordatorios
// - Provee: obtener recordatorios del usuario y crear/actualizar recordatorios
// - Usa sesiones para identificar al usuario actual
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = require('./dbConfig');

// Utilidad: devuelve `user_id` desde la sesión o null si no hay sesión
function getUserId(req) {
  if (req.session && req.session.user && req.session.user.id) {
    return req.session.user.id;
  }
  return null;
}

// GET /reminders - Obtener recordatorios
// - Devuelve todos los recordatorios del usuario autenticado
// - Responde 401 si no hay sesión
router.get('/reminders', async (req, res) => {
  const user_id = getUserId(req);
  if (!user_id) return res.status(401).json({error: "No autenticado"});
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute('SELECT * FROM reminders WHERE user_id=?', [user_id]);
  await conn.end();
  res.json({reminders: rows});
});

// POST /reminders - Crear o actualizar recordatorio
// - Inserta o actualiza un recordatorio identificado por `reminder_code`
// - `reminder_code` actúa como clave única por usuario para evitar duplicados
// - Body esperado: { reminder_code, name, date, icon }
router.post('/reminders', async (req, res) => {
  const user_id = getUserId(req);
  if (!user_id) return res.status(401).json({error: "No autenticado"});
  const { reminder_code, name, date, icon } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  // Busca por reminder_code, NO por name
  const [rows] = await conn.execute('SELECT id FROM reminders WHERE user_id=? AND reminder_code=?', [user_id, reminder_code]);
  if (rows.length) {
    // Si existe, actualiza el recordatorio
    await conn.execute('UPDATE reminders SET name=?, date=?, icon=? WHERE user_id=? AND reminder_code=?', [name, date, icon, user_id, reminder_code]);
  } else {
    // Si no existe, inserta uno nuevo
    await conn.execute('INSERT INTO reminders (user_id, reminder_code, name, date, icon) VALUES (?, ?, ?, ?, ?)', [user_id, reminder_code, name, date, icon]);
  }
  await conn.end();
  res.json({success: true});
});

// Exporta el router para montar en la aplicación principal (server.js)
module.exports = router;