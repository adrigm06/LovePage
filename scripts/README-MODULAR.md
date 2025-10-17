# 📁 Estructura Modular de Scripts - LovePage

## 🎯 Arquitectura

Los scripts han sido modularizados para mejorar la mantenibilidad, escalabilidad y organización del código.

## 📂 Descripción de Módulos

### 🔧 **config.js**
**Propósito:** Configuración centralizada de la aplicación
- Define `APP_CONFIG` con la fecha de inicio
- Variables globales compartidas
- Configuraciones generales

**Dependencias:** Ninguna  
**Usado por:** Todos los módulos

---

### 🎨 **animations.js**
**Propósito:** Gestión de todas las animaciones visuales
- 🫧 Burbujas flotantes (modo día)
- ⭐ Estrellas parpadeantes (modo noche)
- 💓 Corazones flotantes
- 🫀 Indicador de latido

**Funciones principales:**
- `createBubbles()` - Crea burbujas en modo día
- `createStars()` - Crea estrellas en modo noche
- `createHearts()` - Crea animación de corazones
- `checkHeartbeat()` - Activa latido en mensajes especiales

**Exporta:** `window.AnimationsModule`

---

### 🌓 **theme.js**
**Propósito:** Control del tema día/noche
- Toggle de tema
- Persistencia en localStorage
- Coordinación con animaciones

**Funciones principales:**
- `setupNightMode()` - Inicializa el toggle
- `toggleTheme()` - Cambia entre temas
- `loadSavedTheme()` - Carga preferencia guardada

**Dependencias:** animations.js  
**Exporta:** `window.ThemeModule`

---

### 🔢 **counter.js**
**Propósito:** Contadores de días y badges
- Contador principal de días desde el inicio
- Sistema de badges mensuales (mandarinas 🍊)
- Contadores de fechas importantes

**Funciones principales:**
- `actualizarContadorDias()` - Actualiza el contador principal
- `actualizarBadges()` - Actualiza las insignias mensuales
- `calculateDaysDifference()` - Calcula días hasta eventos

**Dependencias:** config.js  
**Exporta:** `window.CounterModule`  
**Global:** `window.actualizarContadorDias` (para login.js)

---

### 💬 **messages.js**
**Propósito:** Sistema de mensajes bonitos
- Lista de mensajes románticos
- Gestión de progreso
- Animaciones de transición

**Funciones principales:**
- `setupMessageButton()` - Configura el botón de mensajes
- `Messages.next()` - Obtiene siguiente mensaje
- `showFinalMessage()` - Muestra mensaje final

**Dependencias:** animations.js  
**Exporta:** `window.MessagesModule`

---

### 🖼️ **gallery.js**
**Propósito:** Funcionalidad de la galería de fotos
- Efectos 3D en hover
- Lazy loading de imágenes
- Modal de ampliación (opcional)

**Funciones principales:**
- `setupGalleryEffects()` - Efectos de inclinación 3D
- `setupLazyLoading()` - Carga diferida de imágenes
- `setupImageModal()` - Modal de visualización

**Exporta:** `window.GalleryModule`

---

### 🎵 **spotify.js**
**Propósito:** Integración con Spotify
- Carga dinámica de playlist del usuario
- Formato de URLs de embed

**Funciones principales:**
- `loadSpotifyPlaylist()` - Carga playlist desde backend

**Exporta:** `window.SpotifyModule`

---


### 🌀 **photos-rotation.js**
**Propósito:** Rotación dinámica de fotos basada en fechas
- Sistema de rotación automática
- Carga desde `photos.json`

**Características:**
- Cambio automático cada día
- Integración con galería

---

### 🔐 **login.js**
**Propósito:** Sistema de autenticación y gestión de usuario
- Login/Registro con backend
- Gestión de sesión (verificación, cierre)
- Modal de configuración de usuario
- Ajustes personalizados (fecha especial, playlist, mensajes)
- Interfaz de usuario (menú dropdown)

**Funciones principales:**
- `checkSession()` - Verifica sesión activa al cargar
- `cargarUsuario(user)` - Carga datos del usuario
- `showLoginModal()` - Muestra modal de login
- `showRegisterModal()` - Muestra modal de registro
- `showSettingsModal()` - Modal de ajustes
- `loadUserSettings()` - Carga configuración guardada
- `saveUserSettings()` - Guarda fecha, playlist y mensajes

**API Endpoints utilizados:**
- `POST /login` - Autenticación
- `POST /register` - Registro de usuario
- `GET /session` - Verificar sesión
- `POST /logout` - Cerrar sesión
- `GET /special-date` - Obtener fecha especial
- `POST /special-date` - Guardar fecha especial
- `GET /spotify-playlist` - Obtener playlist
- `POST /spotify-playlist` - Guardar playlist
- `GET /messages` - Obtener mensajes
- `POST /messages` - Guardar mensajes

**Dependencias:** 
- counter.js (llama a `actualizarContadorDias()` y `actualizarBadges()`)
- Backend en ejecución
- Tablas `users` y `messages` en base de datos

**Eventos:**
- Clicks en botones de login, registro, logout, ajustes
- Submit de formularios
- Apertura/cierre de modales

---

### 📅 **recordatorios.js**
**Propósito:** Gestión de fechas importantes (usado en recordatorios.html)
- Carga de recordatorios del usuario desde backend
- Edición inline de recordatorios (nombre, fecha, icono)
- Cálculo de días hasta/desde eventos
- Guardado automático en base de datos

**Funciones principales:**
- `loadUserReminders()` - Carga recordatorios desde API
- `calculateDaysTo(date)` - Calcula días hasta/desde fecha
- `showDaysRemaining(date)` - Muestra contador formateado
- `editReminder(id)` - Modo edición inline
- `saveReminder(id)` - Guarda cambios en backend
- `updateReminder(reminderData)` - Actualiza en DB vía API

**API Endpoints utilizados:**
- `GET /reminders` - Obtener recordatorios del usuario
- `POST /reminders` - Crear/actualizar recordatorio

**Dependencias:** 
- Requiere sesión activa
- Backend en ejecución
- Tabla `reminders` en base de datos

**Estructura de recordatorio:**
```javascript
{
  id: 1,
  reminder_code: "cumpleanos",
  name: "Cumpleaños 🎂",
  date: "2025-05-15",
  icon: "🎂"
}
```

---

### 🎯 **main.js**
**Propósito:** Coordinador principal
- Inicialización general
- Verificación de módulos
- Utilidades globales
- Manejo de errores

**Funciones principales:**
- `initializeApp()` - Inicializa la app
- `checkModules()` - Verifica módulos cargados
- `setupCustomCursor()` - Cursor personalizado

**Exporta:** `window.AppUtils`

---

## 🔗 Orden de Carga Recomendado

```html
<!-- 1. Configuración -->
<script src="scripts/config.js"></script>

<!-- 2. Módulos base (sin dependencias) -->
<script src="scripts/animations.js"></script>

<!-- 3. Módulos dependientes -->
<script src="scripts/theme.js"></script>        <!-- depende: animations -->
<script src="scripts/counter.js"></script>      <!-- depende: config -->
<script src="scripts/messages.js"></script>     <!-- depende: animations -->
<script src="scripts/gallery.js"></script>
<script src="scripts/spotify.js"></script>
<script src="scripts/photos-rotation.js"></script>

<!-- 4. Integración y específicos -->
<script src="scripts/login.js"></script>        <!-- depende: counter -->
<script src="scripts/recordatorios.js"></script>

<!-- 5. Coordinador (último) -->
<script src="scripts/main.js"></script>
```

## 📊 Dependencias Visuales

```
config.js
    ↓
counter.js ← login.js
    
animations.js
    ↓
    ├─→ theme.js
    └─→ messages.js

gallery.js (independiente)
spotify.js (independiente)
photos-rotation.js (independiente)
recordatorios.js (independiente)

main.js (coordina todo)
```

## ✨ Características

### Módulos Autocontenidos
Cada módulo:
- Se inicializa automáticamente con `DOMContentLoaded`
- Exporta sus funciones a un namespace global
- Puede funcionar independientemente

### Comunicación entre Módulos
```javascript
// Desde theme.js llamando a animations.js
if (window.AnimationsModule) {
  window.AnimationsModule.createStars();
}

// Desde login.js llamando a counter.js
window.actualizarContadorDias();
```

### Ventajas
- ✅ Código más mantenible
- ✅ Fácil depuración
- ✅ Reutilización de código
- ✅ Carga modular
- ✅ Mejor organización

## 🛠️ Uso

### Acceder a módulos desde la consola
```javascript
// Crear corazones manualmente
window.AnimationsModule.createHearts();

// Cambiar tema
window.ThemeModule.toggleTheme();

// Actualizar contador
window.CounterModule.actualizarContadorDias();
```

### Agregar nuevo módulo
1. Crear archivo `nuevo-modulo.js`
2. Estructura básica:
```javascript
/* Descripción del módulo */

function miFuncion() {
  // código
}

document.addEventListener('DOMContentLoaded', () => {
  // inicialización
});

window.MiModulo = {
  miFuncion
};
```
3. Agregar al HTML en el orden correcto
4. Documentar en este README

## 📝 Notas

- Todos los módulos usan `DOMContentLoaded` para auto-inicializarse
- Las funciones se exportan a `window` para comunicación entre módulos
- Se mantiene compatibilidad con código existente
- Los módulos son independientes pero pueden cooperar

---
## 🔄 Flujo de Datos

### Ciclo de Autenticación
```
1. Usuario → login.js (submit formulario)
2. login.js → Backend (POST /login)
3. Backend → Base de datos (validar credenciales)
4. Backend → login.js (respuesta con datos de usuario)
5. login.js → counter.js (actualizar fecha especial)
6. login.js → spotify.js (cargar playlist)
7. login.js → messages.js (cargar mensajes personalizados)
```

### Ciclo de Configuración
```
1. Usuario → Ajustes (modal de settings)
2. login.js → Backend (GET datos actuales)
3. Usuario → Modifica valores
4. login.js → Backend (POST /special-date, /spotify-playlist, /messages)
5. Backend → Base de datos (UPDATE)
6. counter.js/spotify.js/messages.js → Actualizar UI
```

### Ciclo de Recordatorios
```
1. Usuario → recordatorios.html
2. recordatorios.js → Backend (GET /reminders)
3. Backend → Base de datos (SELECT reminders)
4. recordatorios.js → Renderizar en UI
5. Usuario → Editar recordatorio
6. recordatorios.js → Backend (POST /reminders)
7. Backend → Base de datos (INSERT/UPDATE)
```

## 🗄️ Integración con Base de Datos

### Tablas Utilizadas
```sql
-- Usuarios y configuraciones
users (id, username, password, special_date, spotify_playlist)

-- Mensajes personalizados por usuario
messages (id, user_id, message_text, display_order)

-- Recordatorios/fechas importantes por usuario
reminders (id, user_id, reminder_code, name, date, icon)
```

### Relaciones
```
users (1) ─────── (*) messages
  │
  └─────────────── (*) reminders
```
