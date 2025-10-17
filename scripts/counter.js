/* ============================================
	COUNTER.JS - Contador de días y badges
	Contenido: Contador principal, badges mensuales y contadores de recordatorios
   ============================================ */

/* === OBTENER FECHA ESPECIAL === */
function getSpecialDate() {
	// Prioridad: fecha del usuario logueado > configuración global
	return window.userSpecialDate 
		? window.userSpecialDate 
		: (window.APP_CONFIG?.START_DATE || '2025-07-18');
}

/* === ACTUALIZAR CONTADOR DE DÍAS === */
function actualizarContadorDias() {
	// Obtener fecha de inicio y normalizar horas
	const startDate = new Date(getSpecialDate());
	startDate.setHours(0, 0, 0, 0);
	
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	
	// Calcular diferencia en días
	const diffTime = today - startDate;
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	
	// Actualizar elemento en DOM
	const daysSpan = document.getElementById('days');
	if (daysSpan) {
		daysSpan.textContent = diffDays;
	}
	
	// Actualizar badges mensuales
	actualizarBadges(diffDays);
}

/* === ACTUALIZAR BADGES (MANDARINAS 🍊) === */
function actualizarBadges(diffDays) {
	const badgesContainer = document.getElementById('badges');
	if (!badgesContainer) return;
	
	const totalBadges = 12; // 12 meses/badges máximo
	const completedBadges = Math.min(Math.floor(diffDays / 30), totalBadges);
	
	// Limpiar badges existentes
	badgesContainer.innerHTML = '';
	
	// Crear badges
	for (let i = 0; i < totalBadges; i++) {
		const badge = document.createElement('div');
		badge.className = 'badge';
		badge.setAttribute('data-month', i + 1);
		badge.innerHTML = '🍊'; // Cambiar este emoji para cambiar las badges
		
		if (i < completedBadges) {
			badge.classList.add('completed');
			
			// Animación especial para el badge más reciente
			if (i === completedBadges - 1) {
				badge.style.animation = 'mandarinaPop 0.6s';
			}
		}
		
		badgesContainer.appendChild(badge);
	}
}

/* === CONTADOR DE RECORDATORIOS === */
function calculateDaysDifference(counter, originalDate) {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	
	const dateParts = counter.dataset.date.split('-');
	let targetDate;
	
	// Verificar si es tipo mensual (como el día inicial de la relación)
	if (counter.dataset.type === 'monthly') {
		const day = parseInt(dateParts[2] || '18');
		targetDate = new Date(now.getFullYear(), now.getMonth(), day);
		
		// Si ya pasó este mes, calcular para el próximo
		if (targetDate < now) {
			targetDate = new Date(now.getFullYear(), now.getMonth() + 1, day);
		}
	} else {
		// Evento anual (cumpleaños, san valentín, etc.)
		const month = parseInt(dateParts[1]) - 1;
		const day = parseInt(dateParts[2]);
		targetDate = new Date(now.getFullYear(), month, day);
		
		// Si ya pasó este año, calcular para el próximo
		if (targetDate < now) {
			targetDate = new Date(now.getFullYear() + 1, month, day);
		}
	}
	
	targetDate.setHours(0, 0, 0, 0);
	
	// Calcular días restantes
	const diffTime = targetDate - now;
	const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
	
	// Limpiar clases previas para evitar estilos residuales
	const card = counter.closest('.date-card');
	card?.classList.remove('date-card-today');
	counter.classList.remove('days-counter-today');
	
	// Aplicar estilos especiales si es hoy
	if (diffDays === 0) {
		counter.textContent = '¡Es hoy!';
		card?.classList.add('date-card-today');
		counter.classList.add('days-counter-today');
	} else {
		counter.textContent = `Faltan ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
	}
}

/* === INICIALIZACIÓN PARA PÁGINA DE RECORDATORIOS === */
function initRecordatoriosCounter() {
	// Solo ejecutar si estamos en la página de recordatorios
	if (!document.querySelector('.dates-container')) return;
	
	document.querySelectorAll('.days-counter').forEach(counter => {
		const targetDateStr = counter.dataset.date;
		const now = new Date();
		
		if (targetDateStr.split('-').length === 2) {
			// Formato MM-DD (mes-día sin año)
			const [month, day] = targetDateStr.split('-');
			let nextDate = new Date(now.getFullYear(), month - 1, day);
			
			if (nextDate < now) {
				nextDate = new Date(now.getFullYear() + 1, month - 1, day);
			}
			
			calculateDaysDifference(counter, nextDate);
		} else {
			// Formato completo YYYY-MM-DD
			const targetDate = new Date(targetDateStr);
			calculateDaysDifference(counter, targetDate);
		}
	});
}

/* === INICIALIZACIÓN === */
document.addEventListener('DOMContentLoaded', () => {
	actualizarContadorDias();
	initRecordatoriosCounter();
});

/* === EXPORTAR FUNCIONES === */
window.CounterModule = {
	getSpecialDate,
	actualizarContadorDias,
	actualizarBadges,
	calculateDaysDifference,
	initRecordatoriosCounter
};

/* === HACER FUNCIÓN GLOBAL === */
// Necesaria para que login.js pueda llamarla directamente
window.actualizarContadorDias = actualizarContadorDias;
