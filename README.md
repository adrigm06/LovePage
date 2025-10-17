# 💖 LovePage - Todo lo que Amo de Ti 🦭

Un proyecto web personal y especial, creado con mucho cariño para expresar afecto, recordar momentos importantes y personalizar la experiencia. Dedicado a la persona más especial para mí.

## ✨ Características Principales

### 🎨 Interfaz y Experiencia
* **Modo Día/Noche:** Toggle para cambiar el tema visual, con burbujas animadas durante el día y un cielo estrellado por la noche
* **Animaciones Dinámicas:** Corazones flotantes, efectos de máquina de escribir y transiciones suaves
* **Cursor Personalizado:** Cursor con forma de corazón que añade un toque lúdico y cariñoso
* **Diseño Responsive:** Adaptado para verse perfectamente en cualquier dispositivo

### 💬 Contenido Personalizable
* **Mensajes Personalizados:** Sistema de mensajes con efecto de máquina de escribir y latidos del corazón
* **Galería de Fotos:** Espacio dedicado para mostrar imágenes compartidas con efectos 3D
* **Rotación de Fotos:** Sistema de rotación automática de fotos basado en fechas
* **Recordatorios Personalizados:** Página dedicada para gestionar fechas importantes personalizadas

### 📊 Contadores y Fechas
* **Contador de Días:** Calcula y muestra el tiempo desde la fecha de inicio de la relación
* **Sistema de Badges:** Insignias mensuales (mandarinas 🍊) que se desbloquean con el tiempo
* **Fechas Importantes:** Gestión de eventos especiales con iconos personalizables

### 🎵 Multimedia
* **Integración con Spotify:** Reproductor embebido con playlists personalizables por usuario
* **Música de Fondo:** Comparte tu música favorita directamente en la página

### 🔐 Sistema de Usuarios
* **Autenticación:** Sistema completo de login y registro con sesiones
* **Perfiles Personalizados:** Cada usuario puede guardar sus propios mensajes, playlist y fechas
* **Ajustes de Usuario:** Panel para configurar fecha especial, playlist de Spotify y mensajes personalizados

## 🛠️ Tecnologías Utilizadas

### Frontend
* **HTML5** - Estructura semántica y accesible
* **CSS3** - Estilos modulares con variables CSS y animaciones
  * `variables.css` - Variables globales de colores y fuentes
  * `main.css` - Estilos principales
  * `themes.css` - Temas día/noche
  * `animations.css` - Animaciones y efectos
  * `forms-modal.css` - Modales y formularios
  * `login.css` - Estilos de autenticación
  * `gallery.css` - Galería de fotos
  * `recordatorios.css` - Página de recordatorios
* **JavaScript (Vanilla JS)** - Arquitectura modular:
  * `config.js` - Configuración centralizada
  * `animations.js` - Gestión de animaciones
  * `theme.js` - Control de tema día/noche
  * `counter.js` - Contadores y badges
  * `messages.js` - Sistema de mensajes
  * `gallery.js` - Funcionalidad de galería
  * `spotify.js` - Integración con Spotify
  * `photos-rotation.js` - Rotación de fotos
  * `login.js` - Autenticación de usuario
  * `recordatorios.js` - Gestión de recordatorios
  * `main.js` - Coordinador principal

### Backend
* **Node.js** - Servidor backend
* **Express** - Framework web
* **MySQL** - Base de datos relacional
* **Express-Session** - Gestión de sesiones
* **CORS** - Comunicación frontend-backend
* **dotenv** - Variables de entorno

## 📁 Estructura del Proyecto

```
LovePage/
├── index.html                 # Página principal
├── login.html                 # Página de login (legacy)
├── recordatorios.html         # Página de fechas importantes
├── README.md                  # Este archivo
├── icons/                     # Iconos del proyecto
├── img/                       # Imágenes y fotos
│   └── photos.json            # Configuración de rotación de fotos
├── styles/                    # Estilos CSS modulares
│   ├── variables.css
│   ├── main.css
│   ├── themes.css
│   ├── animations.css
│   ├── forms-modal.css
│   ├── login.css
│   ├── gallery.css
│   └── recordatorios.css
├── scripts/                   # Scripts JavaScript modulares
│   ├── config.js
│   ├── animations.js
│   ├── theme.js
│   ├── counter.js
│   ├── messages.js
│   ├── gallery.js
│   ├── spotify.js
│   ├── photos-rotation.js
│   ├── login.js
│   ├── recordatorios.js
│   ├── main.js
│   └── README-MODULAR.md      # Documentación de arquitectura
└── lovepage-backend/          # Backend del proyecto
    ├── server.js              # Servidor principal
    ├── reminders-backend.js   # Router de recordatorios
    ├── dbConfig.js            # Configuración de base de datos
    ├── LovePage.sql           # Schema de base de datos
    ├── package.json
    └── README.md              # Documentación del backend
```

## 🚀 Instalación y Despliegue

### Requisitos Previos
- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- Navegador web moderno

### Configuración del Backend

1. **Navega a la carpeta del backend:**
   ```bash
   cd lovepage-backend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura la base de datos:**
   - Importa el archivo `LovePage.sql` en tu servidor MySQL
   - O deja que el servidor cree las tablas automáticamente al iniciarse

4. **Configura las variables de entorno:**
   - Copia `.env.example` a `.env` (si existe) o crea un archivo `.env`
   ```env
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=lovepage
   DB_PORT=3306
   PORT=4000
   ```

5. **Inicia el servidor:**
   ```bash
   node server.js
   ```
   El backend estará corriendo en `http://localhost:4000`

### Configuración del Frontend

1. **Abre el proyecto en un servidor local:**
   - Usando Live Server en VS Code (recomendado)
   - O cualquier servidor web local en el puerto 5500

2. **Accede a la aplicación:**
   ```
   http://localhost:5500/index.html
   ```

3. **Crea tu cuenta:**
   - Haz clic en "Iniciar sesión"
   - Selecciona "Registrarse"
   - Crea tu usuario y contraseña

4. **Personaliza tu experiencia:**
   - Una vez logueado, ve a "Ajustes" (icono de usuario)
   - Configura tu fecha especial
   - Agrega tu playlist de Spotify
   - Personaliza tus mensajes

### Personalizar Mensajes
1. Inicia sesión
2. Haz clic en tu nombre de usuario (arriba a la derecha)
3. Selecciona "Ajustes"
4. Escribe tus mensajes en el área de texto (uno por línea)
5. Guarda los cambios

### Agregar Recordatorios
1. Ve a la página "Fechas Importantes"
2. Los recordatorios predeterminados se cargarán automáticamente
3. Haz clic en "Editar" para modificar nombres, fechas e iconos
4. Los cambios se guardan automáticamente en la base de datos

## 📚 Documentación Adicional

- **[Arquitectura Modular](scripts/README-MODULAR.md)** - Documentación detallada de la estructura modular de scripts
- **[Backend](lovepage-backend/README.md)** - Configuración y documentación del servidor

## 🎨 Personalización

### Cambiar Colores del Tema
Edita las variables en `styles/variables.css`:
```css
:root {
  --primary-color: #ff69b4;
  --secondary-color: #ffb6c1;
  /* ... más variables */
}
```

### Agregar Más Fotos
1. Coloca tus imágenes en la carpeta `img/`
2. Edita `img/photos.json` para configurar la rotación
3. O modifica directamente el HTML en `index.html`

### Modificar la Fecha de Inicio
La fecha de inicio se configura en `scripts/config.js`:
```javascript
const APP_CONFIG = {
  startDate: new Date('2024-08-22')
};
```

## 🐛 Solución de Problemas

### El contador no se actualiza
- Verifica que estés logueado
- Comprueba que la fecha esté configurada en "Ajustes"
- Revisa la consola del navegador para errores

### No puedo iniciar sesión
- Asegúrate de que el backend esté corriendo en el puerto 4000
- Verifica que la base de datos esté configurada correctamente
- Comprueba las credenciales en el archivo `.env`

### La playlist de Spotify no se carga
- Verifica que la URL sea una playlist válida de Spotify
- Asegúrate de usar el formato correcto de embed
- Comprueba que el backend esté respondiendo a `/spotify-playlist`

## 🤝 Contribuciones

Este es un proyecto personal creado con fines de aprendizaje y expresión personal. Si tienes sugerencias o mejoras, ¡son bienvenidas!

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Autor:** [Adrigm06](https://github.com/adrigm06)
