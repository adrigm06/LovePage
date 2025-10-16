/* ============================================
	RECORDATORIOS.JS - Gestión de fechas importantes
	Contenido: Carga, edición y cálculo de recordatorios personalizados
   ============================================ */

/* === UTILIDAD PARA FORMATEAR FECHAS === */
function formatDateText(dateStr) {
	const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
	const date = new Date(dateStr);
	if (isNaN(date)) return "";
	return `${date.getDate()} de ${meses[date.getMonth()]}`;
}

/* === CALCULAR DÍAS HASTA FECHA === */
// Todas las fechas son anuales. Siempre muestra días hasta la PRÓXIMA ocurrencia
function calculateDaysTo(dateStr) {
	const today = new Date();
	today.setHours(0,0,0,0);

	// Normalizar fecha de entrada (puede venir con año actual/otro año)
	const base = new Date(dateStr);
	if (isNaN(base)) return '';
	const month = base.getMonth();
	const day = base.getDate();

	// Crear fecha del próximo evento este año
	let next = new Date(today.getFullYear(), month, day);
	next.setHours(0,0,0,0);

	// Si ya pasó este año, usar el siguiente
	if (next < today) {
		next = new Date(today.getFullYear() + 1, month, day);
	}

	// Calcular diferencia en días
	const diffDays = Math.round((next - today) / 86400000);
	if (diffDays === 0) return '¡Es hoy!';
	return `Faltan ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
}

/* === MAP DE RECORDATORIOS PREDETERMINADOS === */
const defaultReminders = {};
document.querySelectorAll('.date-card').forEach(card => {
	const reminder_code = card.getAttribute('data-id');
	defaultReminders[reminder_code] = {
		name: card.querySelector('h3').textContent.trim(),
		date: card.querySelector('.days-counter').getAttribute('data-date'),
		icon: card.querySelector('.date-icon').textContent.trim()
	};
});

/* === ELEMENTOS DEL MODAL DE EDICIÓN === */
const editReminderModal = document.getElementById('editReminderModal');
const closeEditModal = document.getElementById('closeEditModal');
const editReminderForm = document.getElementById('editReminderForm');
const editReminderName = document.getElementById('editReminderName');
const editReminderDate = document.getElementById('editReminderDate');
const editReminderIcon = document.getElementById('editReminderIcon');
let editingReminderCode = null;

/* === VERIFICAR SESIÓN Y CARGAR RECORDATORIOS === */
function checkSessionAndLoadReminders() {
	fetch('http://localhost:4000/session', { credentials: 'include' })
		.then(res => res.json())
		.then(data => {
			if (data.logged) {
				loadUserReminders();
			} else {
				// Redirigir a index si no hay sesión
				window.location.href = "index.html";
			}
		});
}

/* === CARGAR RECORDATORIOS DEL USUARIO === */
function loadUserReminders() {
	fetch('http://localhost:4000/reminders', { credentials: 'include' })
		.then(res => res.json())
		.then(data => {
			// Crear mapa de recordatorios del usuario
			const reminders = {};
			(data.reminders || []).forEach(rem => {
				reminders[rem.reminder_code] = rem;
			});
			
			// Actualizar cada card con los datos del usuario o por defecto
			document.querySelectorAll('.date-card').forEach(card => {
				const reminder_code = card.getAttribute('data-id');
				const reminder = reminders[reminder_code] || defaultReminders[reminder_code];
				card.querySelector('.date-icon').textContent = reminder.icon;
				card.querySelector('h3').textContent = reminder.name;
				card.querySelector('.date').textContent = formatDateText(reminder.date);
				card.querySelector('.days-counter').setAttribute('data-date', reminder.date);
				card.querySelector('.days-counter').textContent = calculateDaysTo(reminder.date);
			});
		});
}

/* === CONFIGURAR BOTONES DE EDICIÓN === */
document.querySelectorAll('.edit-reminder-btn').forEach(btn => {
	btn.onclick = function(e) {
		const card = btn.closest('.date-card');
		const reminder_code = card.getAttribute('data-id');
		editingReminderCode = reminder_code;
		
		// Obtener datos actuales del recordatorio
		const currentName = card.querySelector('h3').textContent.trim();
		const currentIcon = card.querySelector('.date-icon').textContent.trim();
		const currentDateText = card.querySelector('.days-counter').getAttribute('data-date');
		
		// Rellenar formulario
		editReminderName.value = currentName;
		editReminderIcon.value = currentIcon;
		editReminderDate.value = currentDateText;
		
		// Mostrar modal
		editReminderModal.style.display = 'block';
	};
});

/* === CERRAR MODAL === */
closeEditModal.onclick = function() {
	editReminderModal.style.display = 'none';
	editingReminderCode = null;
};

// Cerrar al hacer clic fuera del modal
document.addEventListener('click', function(event) {
	if (event.target === editReminderModal) {
		editReminderModal.style.display = 'none';
		editingReminderCode = null;
	}
});

/* === GUARDAR CAMBIOS DEL RECORDATORIO === */
editReminderForm.onsubmit = function(e) {
	e.preventDefault();
	
	const name = editReminderName.value.trim();
	const date = editReminderDate.value;
	const icon = editReminderIcon.value;
	
	fetch('http://localhost:4000/reminders', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ reminder_code: editingReminderCode, name, date, icon })
	})
	.then(res => res.json())
	.then(data => {
		if(data.success) {
			// Recargar recordatorios y cerrar modal
			loadUserReminders();
			editReminderModal.style.display = 'none';
			editingReminderCode = null;
		} else {
			alert('Error al guardar cambios');
		}
	});
};

/* === INICIALIZACIÓN === */
document.addEventListener('DOMContentLoaded', checkSessionAndLoadReminders);