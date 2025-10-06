// Utilidad para convertir fecha a texto bonito
function formatDateText(dateStr) {
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return `${date.getDate()} de ${meses[date.getMonth()]}`;
}

function calculateDaysTo(dateStr) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const target = new Date(dateStr);
  target.setHours(0,0,0,0);
  let diff = Math.round((target - today) / (1000*60*60*24));
  if (diff === 0) return "¡Es hoy!";
  return diff > 0 ? `Faltan ${diff} días` : `Hace ${-diff} días`;
}

// Map de recordatorios predeterminados
const defaultReminders = {};
document.querySelectorAll('.date-card').forEach(card => {
  const reminder_code = card.getAttribute('data-id');
  defaultReminders[reminder_code] = {
    name: card.querySelector('h3').textContent.trim(),
    date: card.querySelector('.days-counter').getAttribute('data-date'),
    icon: card.querySelector('.date-icon').textContent.trim()
  };
});

// Modal y funcionalidad de edición
const editReminderModal = document.getElementById('editReminderModal');
const closeEditModal = document.getElementById('closeEditModal');
const editReminderForm = document.getElementById('editReminderForm');
const editReminderName = document.getElementById('editReminderName');
const editReminderDate = document.getElementById('editReminderDate');
const editReminderIcon = document.getElementById('editReminderIcon');
let editingReminderCode = null;

function checkSessionAndLoadReminders() {
  fetch('http://localhost:4000/session', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (data.logged) {
        loadUserReminders();
      } else {
        window.location.href = "index.html";
      }
    });
}

function loadUserReminders() {
  fetch('http://localhost:4000/reminders', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      const reminders = {};
      (data.reminders || []).forEach(rem => {
        reminders[rem.reminder_code] = rem;
      });
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

// Editar recordatorio
document.querySelectorAll('.edit-reminder-btn').forEach(btn => {
  btn.onclick = function(e) {
    const card = btn.closest('.date-card');
    const reminder_code = card.getAttribute('data-id');
    editingReminderCode = reminder_code;
    const currentName = card.querySelector('h3').textContent.trim();
    const currentIcon = card.querySelector('.date-icon').textContent.trim();
    const currentDateText = card.querySelector('.days-counter').getAttribute('data-date');
    editReminderName.value = currentName;
    editReminderIcon.value = currentIcon;
    editReminderDate.value = currentDateText;
    editReminderModal.style.display = 'block';
  };
});

closeEditModal.onclick = function() {
  editReminderModal.style.display = 'none';
  editingReminderCode = null;
};
window.onclick = function(event) {
  if (event.target === editReminderModal) {
    editReminderModal.style.display = 'none';
    editingReminderCode = null;
  }
};

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
      loadUserReminders();
      editReminderModal.style.display = 'none';
      editingReminderCode = null;
    } else {
      alert('Error al guardar cambios');
    }
  });
};

document.addEventListener('DOMContentLoaded', checkSessionAndLoadReminders);