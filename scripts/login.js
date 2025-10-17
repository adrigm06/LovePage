/* ============================================
	LOGIN.JS - Sistema de autenticación y usuario
	Contenido: Login, registro, sesión, ajustes de usuario
   ============================================ */

/* === FUNCIONES DE MENSAJES GENÉRICAS === */
function showMessage(element, msg, success = false) {
	element.textContent = msg;
	element.classList.add('show');
	element.classList.toggle('success', success);
}

function clearMessage(element) {
	element.textContent = "";
	element.classList.remove('show', 'success');
}

/* === ELEMENTOS DEL DOM === */
/* Elementos de login */
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.getElementById('closeLogin');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('login-message');

/* Elementos de registro */
const showRegister = document.getElementById('showRegister');
const registerModal = document.getElementById('registerModal');
const closeRegister = document.getElementById('closeRegister');
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('register-message');

/* Elementos de usuario */
const userArea = document.getElementById('userArea');
const userWelcome = document.getElementById('userWelcome');
const logoutBtn = document.getElementById('logoutBtn');
const logoutMenu = document.getElementById('logoutMenu');
const loginHeader = document.getElementById('loginHeader');

/* Elementos de ajustes */
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const settingsForm = document.getElementById('settingsForm');
const settingsMessage = document.getElementById('settings-message');
const specialDateInput = document.getElementById('specialDate');
const specialDateText = document.getElementById('specialDateText');

/* === ABRIR/CERRAR MODALS === */
/* Abrir modal de login */
loginBtn.onclick = function() {
	loginModal.style.display = 'block';
	loginForm.username.focus();
};

/* Cerrar modal de login */
closeLogin.onclick = function() {
	loginModal.style.display = 'none';
	clearMessage(loginMessage);
};

/* Cambiar a modal de registro */
showRegister.onclick = function() {
	loginModal.style.display = 'none';
	registerModal.style.display = 'block';
	registerForm.regUsername.focus();
};

/* Cerrar modal de registro */
closeRegister.onclick = function() {
	registerModal.style.display = 'none';
	clearMessage(registerMessage);
};

/* Cerrar modals al hacer clic fuera */
document.addEventListener('click', function(event) {
	if (event.target === loginModal) {
		loginModal.style.display = 'none';
		clearMessage(loginMessage);
	}
	if (event.target === registerModal) {
		registerModal.style.display = 'none';
		clearMessage(registerMessage);
	}
	if (event.target === settingsModal) {
		settingsModal.style.display = 'none';
		settingsMessage.textContent = "";
	}
});

/* Cerrar modals con tecla ESC */
window.addEventListener('keydown', function(e){
	if(e.key==="Escape") {
		loginModal.style.display = 'none';
		clearMessage(loginMessage);
		registerModal.style.display = 'none';
		clearMessage(registerMessage);
		settingsModal.style.display = 'none';
		settingsMessage.textContent = "";
	}
});

/* === REGISTRO DE USUARIO === */
registerForm.onsubmit = function(e) {
	e.preventDefault();
	var regUser = registerForm.regUsername.value.trim();
	var regPass = registerForm.regPassword.value;
	clearMessage(registerMessage);

	fetch('http://localhost:4000/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: regUser, password: regPass })
	})
	.then(res => res.json())
	.then(data => {
		if (data.success) {
			showMessage(registerMessage, "¡Registro exitoso! Ahora inicia sesión.", true);
			// Redirigir a login después de un momento
			setTimeout(() => {
				registerModal.style.display = 'none';
				loginModal.style.display = 'block';
				registerForm.reset();
				clearMessage(registerMessage);
			}, 1300);
		} else {
			showMessage(registerMessage, data.error || "Error en el registro.");
		}
	}).catch(() => {
		showMessage(registerMessage, "Servidor no disponible. Intenta más tarde.");
	});
};

/* === LOGIN DE USUARIO === */
loginForm.onsubmit = function(e) {
	e.preventDefault();
	var loginUser = loginForm.username.value.trim();
	var loginPass = loginForm.password.value;
	clearMessage(loginMessage);

	fetch('http://localhost:4000/login', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: loginUser, password: loginPass })
	})
	.then(res => res.json())
	.then(data => {
		if (data.success) {
			showMessage(loginMessage, "¡Login exitoso! Bienvenido, " + loginUser, true);
			// Cerrar modal y cargar datos del usuario
			setTimeout(() => {
				loginModal.style.display = 'none';
				loginForm.reset();
				clearMessage(loginMessage);
				cargarUsuario();
			}, 1000);
		} else {
			showMessage(loginMessage, data.error || "Usuario o contraseña incorrectos 💔");
		}
	}).catch(() => {
		showMessage(loginMessage, "Servidor no disponible. Intenta más tarde.");
	});
};

/* === CARGAR USUARIO Y DATOS === */
// Muestra usuario logueado arriba derecha y actualiza fecha, badges y mensajes
async function cargarUsuario() {
	try {
		const res = await fetch('http://localhost:4000/session', {
			credentials: 'include'
		});
		const data = await res.json();

		if (data.logged && data.user) {
			// Usuario logueado - Mostrar información
			userArea.style.display = 'flex';
			userWelcome.textContent = `${data.user.username}`;
			loginHeader.style.display = 'none';
			logoutMenu.style.display = 'none';

			// Actualizar fecha especial y contador (ya viene en formato YYYY-MM-DD)
			window.userSpecialDate = data.user.special_date || null;
			if (specialDateText) specialDateText.textContent = '';
			actualizarContadorDias();

			// Cargar mensajes personalizados del usuario
			if (window.MessagesModule && window.MessagesModule.Messages) {
				await window.MessagesModule.Messages.loadUserMessages();
			}
		} else {
			// No hay usuario - Mostrar vista pública
			userArea.style.display = 'none';
			loginHeader.style.display = '';
			logoutMenu.style.display = 'none';
			window.userSpecialDate = null;
			if (specialDateText) specialDateText.textContent = '';
			actualizarContadorDias();

			// Usar mensajes por defecto
			if (window.MessagesModule && window.MessagesModule.Messages) {
				window.MessagesModule.Messages.list = [...window.MessagesModule.DEFAULT_MESSAGES];
				window.MessagesModule.Messages.reset();
			}
		}
	} catch (error) {
		console.error('Error al cargar usuario:', error);
	}
}

/* === MENÚ DE USUARIO (LOGOUT/AJUSTES) === */
/* Toggle del menú al hacer clic en el nombre de usuario */
userWelcome.onclick = function() {
	logoutMenu.style.display = (logoutMenu.style.display === 'none' || logoutMenu.style.display === '') ? 'block' : 'none';
};

/* Accesibilidad: permitir abrir con teclado */
userWelcome.onkeydown = function(e) {
	if (e.key === 'Enter' || e.key === ' ') userWelcome.click();
};

/* Cerrar menú al hacer clic fuera */
document.addEventListener('click', function(e) {
	if (!userWelcome.contains(e.target) && !logoutMenu.contains(e.target)) {
		logoutMenu.style.display = 'none';
	}
});

/* === BOTÓN DE AJUSTES === */
settingsBtn.onclick = function() {
	logoutMenu.style.display = 'none';
	settingsModal.style.display = 'block';
	cargarFechaEspecial();
};

/* === CERRAR MODAL DE AJUSTES === */
closeSettings.onclick = function() {
	settingsModal.style.display = 'none';
	settingsMessage.textContent = "";
};

/* === CARGAR FECHA ESPECIAL === */
// Se ejecuta al abrir el modal de ajustes
function cargarFechaEspecial() {
	fetch('http://localhost:4000/special-date', { credentials: 'include' })
		.then(res => res.json())
		.then(data => {
			if (data.special_date) {
				// La fecha ya viene en formato YYYY-MM-DD desde el backend
				specialDateInput.value = data.special_date;
			} else {
				specialDateInput.value = "";
			}
		});
}

// Guardar fecha especial y actualizar contador y badges
settingsForm.onsubmit = function(e) {
	e.preventDefault();
	const date = specialDateInput.value;
	fetch('http://localhost:4000/special-date', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ special_date: date })
	})
	.then(res => res.json())
	.then(data => {
		if (data.success) {
			settingsMessage.textContent = "¡Ajustes Actualizados!";
			settingsMessage.classList.add('show', 'success');
			window.userSpecialDate = date;
			actualizarContadorDias();
			setTimeout(() => {
				settingsModal.style.display = 'none';
				settingsMessage.textContent = "";
				cargarUsuario();
			}, 1000);
		} else {
			settingsMessage.textContent = "Error al guardar.";
			settingsMessage.classList.add('show');
		}
	}).catch(() => {
		settingsMessage.textContent = "Servidor no disponible.";
		settingsMessage.classList.add('show');
	});
};

// Al abrir modal de ajustes, carga el playlist del usuario y los mensajes
document.getElementById('settingsBtn').addEventListener('click', function() {
	// Cargar playlist
	fetch('http://localhost:4000/spotify-playlist', { credentials: 'include' })
		.then(res => res.json())
		.then(data => {
			document.getElementById('spotifyPlaylist').value = data.playlist || '';
		});

	// Cargar mensajes
	fetch('http://localhost:4000/messages', { credentials: 'include' })
		.then(res => res.json())
		.then(data => {
			const messagesTextarea = document.getElementById('userMessages');
			if (data.messages && data.messages.length > 0) {
				messagesTextarea.value = data.messages.join('\n');
			} else {
				// Si no hay mensajes personalizados, mostrar los por defecto
				if (window.MessagesModule && window.MessagesModule.DEFAULT_MESSAGES) {
					messagesTextarea.value = window.MessagesModule.DEFAULT_MESSAGES.join('\n');
				}
			}
		})
		.catch(() => {
			// En caso de error, mostrar mensajes por defecto
			if (window.MessagesModule && window.MessagesModule.DEFAULT_MESSAGES) {
				document.getElementById('userMessages').value = window.MessagesModule.DEFAULT_MESSAGES.join('\n');
			}
		});
});

// Al guardar ajustes, también guarda la playlist y los mensajes
document.getElementById('settingsForm').addEventListener('submit', async function(e) {
	e.preventDefault();

	const playlist = document.getElementById('spotifyPlaylist').value.trim();
	const messagesText = document.getElementById('userMessages').value;
	const messagesArray = messagesText
		.split('\n')
		.map(msg => msg.trim())
		.filter(msg => msg.length > 0); // Eliminar líneas vacías

	try {
		// Guardar playlist
		await fetch('http://localhost:4000/spotify-playlist', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ playlist })
		});

		// Guardar mensajes
		await fetch('http://localhost:4000/messages', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: messagesArray })
		});

		// Recargar mensajes en la página
		if (window.MessagesModule && window.MessagesModule.Messages) {
			await window.MessagesModule.Messages.loadUserMessages();
			window.MessagesModule.Messages.reset();

			// Actualizar el texto del mensaje visible
			const messageBox = document.getElementById('randomMessage');
			if (messageBox) {
				messageBox.textContent = 'Haz clic en el botón para descubrir algo que amo de ti ❤️';
			}

			// Rehabilitar el botón si estaba deshabilitado
			const showBtn = document.getElementById('showBtn');
			if (showBtn && showBtn.classList.contains('btn-disabled')) {
				showBtn.disabled = false;
				showBtn.classList.remove('btn-disabled');
				showBtn.innerHTML = '<i id="heartIcon" class="fas fa-heart" style="margin-right: 10px;"></i>Descubrir más 🦭';
			}
		}

		settingsMessage.textContent = "¡Todos los ajustes guardados correctamente!";
		settingsMessage.classList.add('show', 'success');

		setTimeout(() => {
			settingsModal.style.display = 'none';
			settingsMessage.textContent = "";
			settingsMessage.classList.remove('show', 'success');
		}, 1500);

	} catch (error) {
		settingsMessage.textContent = "Error al guardar los ajustes.";
		settingsMessage.classList.add('show');
	}
});

// Logout
logoutBtn.onclick = function() {
	fetch('http://localhost:4000/logout', {
		method: 'POST',
		credentials: 'include'
	}).then(() => {
    userArea.style.display = 'none';
    loginHeader.style.display = '';
    logoutMenu.style.display = 'none';
    window.userSpecialDate = null;
    if (specialDateText) specialDateText.textContent = '';
    actualizarContadorDias();
    
    // Resetear mensajes a los por defecto
    if (window.MessagesModule && window.MessagesModule.Messages) {
		window.MessagesModule.Messages.list = [...window.MessagesModule.DEFAULT_MESSAGES];
		window.MessagesModule.Messages.reset();

      	// Resetear la UI de mensajes
		const messageBox = document.getElementById('randomMessage');
		if (messageBox) {
			messageBox.textContent = 'Haz clic en el botón para descubrir algo que amo de ti ❤️';
		}

		const showBtn = document.getElementById('showBtn');
		if (showBtn && showBtn.classList.contains('btn-disabled')) {
			showBtn.disabled = false;
			showBtn.classList.remove('btn-disabled');
			showBtn.innerHTML = '<i id="heartIcon" class="fas fa-heart" style="margin-right: 10px;"></i>Descubrir más 🦭';
		}
    }
	});
};

// Al cargar la página, mostrar usuario y contador si está logueado
document.addEventListener('DOMContentLoaded', cargarUsuario);