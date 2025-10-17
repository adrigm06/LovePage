/* ============================================
	MAIN.JS - Coordinador principal de la aplicación
	Contenido: Inicialización, verificación de módulos, utilidades globales
   ============================================ */

/* === INICIALIZACIÓN PRINCIPAL === */
document.addEventListener('DOMContentLoaded', function() {
	console.log('🎉 LovePage iniciada');
	
	// Los módulos se inicializan automáticamente con sus propios DOMContentLoaded
	// Este archivo solo coordina funcionalidades especiales si son necesarias
	
	initializeApp();
});

/* === FUNCIÓN DE INICIALIZACIÓN === */
function initializeApp() {
	// Verificar que los módulos estén cargados
	checkModules();
	
	// Inicializar cursor personalizado
	setupCustomCursor();
}

/* === VERIFICAR MÓDULOS CARGADOS === */
function checkModules() {
	const requiredModules = [
		'AnimationsModule',
		'ThemeModule',
		'CounterModule',
		'MessagesModule'
	];
	
	requiredModules.forEach(moduleName => {
		if (window[moduleName]) {
			console.log(`✅ ${moduleName} cargado`);
		} else {
			console.warn(`⚠️ ${moduleName} no está disponible`);
		}
	});
}

/* === CURSOR PERSONALIZADO === */
function setupCustomCursor() {
	// Variables para tracking del cursor
	let mouseX = 0;
	let mouseY = 0;
	
	document.addEventListener('mousemove', (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
		
		// Actualizar variables CSS para el efecto de cursor
		document.documentElement.style.setProperty('--x', `${mouseX}px`);
		document.documentElement.style.setProperty('--y', `${mouseY}px`);
	});
}

/* === UTILIDADES GLOBALES === */

/* Función para mostrar notificaciones temporales (Para Futuros usos) */
/*
function showNotification(message, duration = 3000) {
	const notification = document.createElement('div');
	notification.textContent = message;
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		background: rgba(233, 30, 99, 0.95);
		color: white;
		padding: 15px 25px;
		border-radius: 10px;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
		z-index: 10000;
		animation: slideInRight 0.3s ease;
		font-family: 'Montserrat', sans-serif;
		font-weight: 500;
	`;
	
	document.body.appendChild(notification);
	
	// Auto-eliminar notificación
	setTimeout(() => {
		notification.style.animation = 'slideOutRight 0.3s ease';
		setTimeout(() => notification.remove(), 300);
	}, duration);
}
*/

/* === EXPORTAR UTILIDADES === */
window.AppUtils = {
	//showNotification
};

/* === MANEJO DE ERRORES GLOBAL === */
window.addEventListener('error', (event) => {
	console.error('❌ Error en la aplicación:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
	console.error('❌ Promesa rechazada:', event.reason);
});
