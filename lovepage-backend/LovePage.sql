-- Esquema de LovePage para PostgreSQL

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  special_date DATE NULL,
  spotify_playlist VARCHAR(255) DEFAULT NULL
);

-- Tabla de recordatorios
CREATE TABLE IF NOT EXISTS reminders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  reminder_code VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  icon VARCHAR(10) DEFAULT '🎉',
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, reminder_code)
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  message_text TEXT NOT NULL,
  display_order INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);