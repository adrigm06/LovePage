/* ============================================
	THEME.JS - Gestión del tema día/noche
	Contenido: Toggle de tema, persistencia y coordinación con animaciones
   ============================================ */

/* === CONFIGURACIÓN Y TOGGLE DEL TEMA === */
function setupNightMode() {
	// Crear toggle si no existe
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

	// Cargar tema guardado del localStorage
	loadSavedTheme();
}

/* === ALTERNAR TEMA === */
function toggleTheme() {
	document.body.classList.toggle('night-mode');
	const isNightMode = document.body.classList.contains('night-mode');
	
	// Guardar preferencia en localStorage
	localStorage.setItem('nightMode', isNightMode);
	
	// Actualizar animaciones según el tema
	if (isNightMode) {
		// Modo noche: estrellas
		if (window.AnimationsModule) {
			window.AnimationsModule.createStars();
			window.AnimationsModule.removeBubbles();
		}
	} else {
		// Modo día: burbujas
		if (window.AnimationsModule) {
			window.AnimationsModule.removeStars();
			window.AnimationsModule.createBubbles();
		}
	}
}

/* === CARGAR TEMA GUARDADO === */
function loadSavedTheme() {
	const savedTheme = localStorage.getItem('nightMode');
	
	if (savedTheme === 'true' || document.body.classList.contains('night-mode')) {
		document.body.classList.add('night-mode');
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

/* === INICIALIZACIÓN === */
document.addEventListener('DOMContentLoaded', setupNightMode);

/* === EXPORTAR FUNCIONES === */
window.ThemeModule = {
	setupNightMode,
	toggleTheme,
	loadSavedTheme
};
