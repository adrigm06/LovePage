/* ============================================
   THEME.JS - Gestión del tema día/noche
   ============================================ */

// === CONFIGURACIÓN Y TOGGLE DEL TEMA ===
function setupNightMode() {
  const toggle = document.createElement('div');
  toggle.className = 'theme-toggle';
  toggle.innerHTML = `
    <i class="fas fa-sun sun"></i>
    <i class="fas fa-moon moon"></i>
  `;
  document.body.appendChild(toggle);

  // Toggle al hacer clic
  toggle.addEventListener('click', () => {
    toggleTheme();
  });

  // Cargar tema guardado
  loadSavedTheme();
}

function toggleTheme() {
  document.body.classList.toggle('night-mode');
  const isNightMode = document.body.classList.contains('night-mode');
  
  // Guardar preferencia
  localStorage.setItem('nightMode', isNightMode);
  
  // Actualizar animaciones según el tema
  if (isNightMode) {
    if (window.AnimationsModule) {
      window.AnimationsModule.createStars();
      window.AnimationsModule.removeBubbles();
    }
  } else {
    if (window.AnimationsModule) {
      window.AnimationsModule.removeStars();
      window.AnimationsModule.createBubbles();
    }
  }
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('nightMode');
  
  if (savedTheme === 'true') {
    document.body.classList.add('night-mode');
    if (window.AnimationsModule) {
      window.AnimationsModule.createStars();
      // Asegurar que no queden burbujas del modo día al iniciar en noche
      window.AnimationsModule.removeBubbles();
    }
  } else if (document.body.classList.contains('night-mode')) {
    // Si por alguna razón ya tiene la clase
    if (window.AnimationsModule) {
      window.AnimationsModule.createStars();
      window.AnimationsModule.removeBubbles();
    }
  } else {
    // Modo día por defecto
    if (window.AnimationsModule) {
      window.AnimationsModule.createBubbles();
    }
  }
}

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', setupNightMode);

// === EXPORTAR FUNCIONES ===
window.ThemeModule = {
  setupNightMode,
  toggleTheme,
  loadSavedTheme
};
