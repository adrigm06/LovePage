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

	fetch(`${window.APP_CONFIG.API_URL}/register`, {
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
// La lógica de 'onsubmit' ha sido modificada para usar la respuesta directa del login
loginForm.onsubmit = function(e) {
	e.preventDefault();
	var loginUser = loginForm.username.value.trim();
	var loginPass = loginForm.password.value;
	clearMessage(loginMessage);

	fetch(`${window.APP_CONFIG.API_URL}/login`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username: loginUser, password: loginPass })
	})
	.then(res => {
        // Manejo de errores mejorado para obtener el mensaje del servidor
        if (!res.ok) {
            return res.json().then(errData => {
                throw new Error(errData.error || `Error ${res.status}`);
            });
        }
        return res.json();
    })
	.then(data => {
		if (data.success && data.user) {
			showMessage(loginMessage, "¡Login exitoso! Bienvenido, " + data.user.username, true);

			/* En lugar de llamar a cargarUsuario(), usamos los datos que el backend
			ya nos dio en la respuesta del login. */
			updateUIForLoggedInUser(data.user);
			
			// Cerrar modal y cargar datos del usuario
			setTimeout(() => {
				loginModal.style.display = 'none';
				loginForm.reset();
				clearMessage(loginMessage);
				// La llamada a cargarUsuario() se ha eliminado de aquí.
			}, 1000);
		} else {
			// Si data.success no es true o no viene data.user
            throw new Error(data.error || "Respuesta inesperada del servidor.");
		}
	}).catch((err) => {
		showMessage(loginMessage, err.message || "Usuario o contraseña incorrectos 💔");
	});
};


/* === FUNCIÓN PARA ACTUALIZAR UI AL LOGUEARSE === */
async function updateUIForLoggedInUser(user) {
	// Usuario logueado - Mostrar información
	userArea.style.display = 'flex';
	userWelcome.textContent = `${user.username}`;
	loginHeader.style.display = 'none';
	logoutMenu.style.display = 'none';

	// Actualizar fecha especial y contador
	window.userSpecialDate = user.special_date || null;
	if (specialDateText) specialDateText.textContent = '';
	
	// Asegurarse de que el módulo counter exista antes de llamarlo
	if (typeof window.actualizarContadorDias === 'function') {
		window.actualizarContadorDias();
	}

	// Cargar mensajes personalizados del usuario
	if (window.MessagesModule && window.MessagesModule.Messages) {
		await window.MessagesModule.Messages.loadUserMessages();
	}
	
	// Cargar playlist personalizada
    if (window.SpotifyModule && typeof window.SpotifyModule.loadSpotifyPlaylist === 'function') {
        window.SpotifyModule.loadSpotifyPlaylist();
    }
}

/* === FUNCIÓN PARA ACTUALIZAR UI AL DESLOGUEARSE === */
// Esta función centraliza la lógica para mostrar el estado "no logueado".
function updateUIForLoggedOutUser() {
	// No hay usuario - Mostrar vista pública
	userArea.style.display = 'none';
	loginHeader.style.display = '';
	logoutMenu.style.display = 'none';
	window.userSpecialDate = null;
	if (specialDateText) specialDateText.textContent = '';
	
	// Asegurarse de que el módulo counter exista antes de llamarlo
	if (typeof window.actualizarContadorDias === 'function') {
		window.actualizarContadorDias(); // Esto usará la fecha por defecto
	}

	// Usar mensajes por defecto
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
	
	// Cargar playlist por defecto (o simplemente recargar)
    if (window.SpotifyModule && typeof window.SpotifyModule.loadSpotifyPlaylist === 'function') {
        // Aquí podrías tener una función que cargue una playlist por defecto
        // Por ahora, solo recargamos (lo que probablemente cargue la por defecto)
        window.SpotifyModule.loadSpotifyPlaylist();
    }
}


/* === CARGAR USUARIO Y DATOS === */
// Esta función ahora solo se usa al cargar la página para verificar si ya hay una sesión.
// Ha sido renombrada de 'cargarUsuario' a 'checkSessionOnLoad' para ser más clara.
async function checkSessionOnLoad() {
	try {
		const res = await fetch(`${window.APP_CONFIG.API_URL}/session`, {
			credentials: 'include'
		});
		const data = await res.json();

		if (data.logged && data.user) {
			// Sesión activa encontrada, actualizar UI
			updateUIForLoggedInUser(data.user);
		} else {
			// No hay sesión, mostrar UI de "no logueado"
			updateUIForLoggedOutUser();
		}
	} catch (error) {
		console.error('Error al verificar sesión:', error);
		updateUIForLoggedOutUser(); // Asumir no logueado si hay error
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
    // Añadidas comprobaciones para evitar errores si los elementos no existen
	if (userWelcome && !userWelcome.contains(e.target) && logoutMenu && !logoutMenu.contains(e.target)) {
		logoutMenu.style.display = 'none';
	}
});

/* === BOTÓN DE AJUSTES === */
settingsBtn.onclick = function() {
	logoutMenu.style.display = 'none';
	settingsModal.style.display = 'block';
	
	// Cargar datos actuales en el modal de ajustes
    // Usamos /session para obtener los datos más frescos del usuario logueado
    fetch(`${window.APP_CONFIG.API_URL}/session`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
        if(data.logged && data.user){
            document.getElementById('specialDate').value = data.user.special_date || '';
            document.getElementById('spotifyPlaylist').value = data.user.spotify_playlist || '';
             // Cargar mensajes
            return fetch(`${window.APP_CONFIG.API_URL}/messages`, { credentials: 'include' });
        }
        throw new Error("No hay sesión para cargar ajustes.");
    })
    .then(resMsg => resMsg.json())
    .then(dataMsg => {
        const messagesTextarea = document.getElementById('userMessages');
        if (dataMsg.messages && dataMsg.messages.length > 0) {
            messagesTextarea.value = dataMsg.messages.join('\n');
        } else {
            messagesTextarea.value = (window.MessagesModule && window.MessagesModule.DEFAULT_MESSAGES) ? window.MessagesModule.DEFAULT_MESSAGES.join('\n') : '';
        }
    })
    .catch(err => {
        console.warn("Error al cargar ajustes:", err.message);
        // Poblar con mensajes por defecto si falla la carga
        const messagesTextarea = document.getElementById('userMessages');
        if (messagesTextarea && window.MessagesModule && window.MessagesModule.DEFAULT_MESSAGES) {
            messagesTextarea.value = window.MessagesModule.DEFAULT_MESSAGES.join('\n');
        }
    });
};

/* === CERRAR MODAL DE AJUSTES === */
closeSettings.onclick = function() {
	settingsModal.style.display = 'none';
	settingsMessage.textContent = "";
};

/* === CARGAR FECHA ESPECIAL === */
// Esta función ya no se usa, la lógica se movió a 'settingsBtn.onclick'
function cargarFechaEspecial() {
	// (Código obsoleto mantenido por si acaso, pero no es llamado)
	fetch(`${window.APP_CONFIG.API_URL}/special-date`, { credentials: 'include' })
		.then(res => res.json())
		.then(data => {
			if (data.special_date) {
				specialDateInput.value = data.special_date;
			} else {
				specialDateInput.value = "";
			}
		});
}

// Guardar fecha especial y actualizar contador y badges
// Este formulario ahora guarda TODO (fecha, playlist y mensajes)
settingsForm.onsubmit = async function(e) {
	e.preventDefault();
	clearMessage(settingsMessage);
	
	// Recolectar todos los datos del formulario
	const date = specialDateInput.value;
	const playlist = document.getElementById('spotifyPlaylist').value.trim();
	const messagesText = document.getElementById('userMessages').value;
	const messagesArray = messagesText
		.split('\n')
		.map(msg => msg.trim())
		.filter(msg => msg.length > 0); // Eliminar líneas vacías

	try {
		// Guardar fecha especial
        await fetch(`${window.APP_CONFIG.API_URL}/special-date`, {
            method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ special_date: date })
        });
		
		// Guardar playlist
		await fetch(`${window.APP_CONFIG.API_URL}/spotify-playlist`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ playlist })
		});

		// Guardar mensajes
		await fetch(`${window.APP_CONFIG.API_URL}/messages`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ messages: messagesArray })
		});
		
		// Todo salió bien, mostrar mensaje de éxito
		showMessage(settingsMessage, "¡Todos los ajustes guardados correctamente!", true);
		
		// Actualizar la UI inmediatamente
		window.userSpecialDate = date;
		if (typeof window.actualizarContadorDias === 'function') {
			window.actualizarContadorDias();
		}
		if (window.MessagesModule && window.MessagesModule.Messages) {
			await window.MessagesModule.Messages.loadUserMessages();
			window.MessagesModule.Messages.reset();
			// (La lógica para resetear el botón de mensajes ya no está aquí, está en updateUIForLoggedOutUser)
		}
		if (window.SpotifyModule && typeof window.SpotifyModule.loadSpotifyPlaylist === 'function') {
			window.SpotifyModule.loadSpotifyPlaylist();
		}

		setTimeout(() => {
			settingsModal.style.display = 'none';
			clearMessage(settingsMessage);
		}, 1500);

	} catch (error) {
		console.error("Error guardando ajustes:", error);
		showMessage(settingsMessage, "Error al guardar los ajustes.");
	}
};

// Al guardar ajustes, carga el playlist del usuario y los mensajes
// La lógica de este listener se movió a 'settingsBtn.onclick'

// La lógica de este listener se movió a 'settingsForm.onsubmit'

// Logout
logoutBtn.onclick = function() {
	fetch(`${window.APP_CONFIG.API_URL}/logout`, {
		method: 'POST',
		credentials: 'include'
	})
	.then(res => res.json())
	.then(data => {
		if (data.success) {
			// Llamar a la función centralizada de reseteo
			updateUIForLoggedOutUser();
		}
	})
	.catch(err => {
		console.error("Error en logout:", err);
		// Forzar logout en el frontend aunque falle la petición
		updateUIForLoggedOutUser();
	});
};

// Al cargar la página, mostrar usuario y contador si está logueado
// Llama a la nueva función de verificación de sesión
document.addEventListener('DOMContentLoaded', checkSessionOnLoad);