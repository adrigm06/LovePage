function showLoginMessage(msg, success=false) {
  loginMessage.textContent = msg;
  loginMessage.classList.add('show');
  loginMessage.classList.toggle('success', success);
}
function clearLoginMessage() {
  loginMessage.textContent = "";
  loginMessage.classList.remove('show', 'success');
}
function showRegisterMessage(msg, success=false) {
  registerMessage.textContent = msg;
  registerMessage.classList.add('show');
  registerMessage.classList.toggle('success', success);
}
function clearRegisterMessage() {
  registerMessage.textContent = "";
  registerMessage.classList.remove('show', 'success');
}

// Elementos principales
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.getElementById('closeLogin');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('login-message');
const showRegister = document.getElementById('showRegister');
const registerModal = document.getElementById('registerModal');
const closeRegister = document.getElementById('closeRegister');
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('register-message');
const userArea = document.getElementById('userArea');
const userWelcome = document.getElementById('userWelcome');
const logoutBtn = document.getElementById('logoutBtn');
const logoutMenu = document.getElementById('logoutMenu');
const loginHeader = document.getElementById('loginHeader');

// Ajustes
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const settingsForm = document.getElementById('settingsForm');
const settingsMessage = document.getElementById('settings-message');
const specialDateInput = document.getElementById('specialDate');
const specialDateText = document.getElementById('specialDateText');

// Abrir/cerrar modals
loginBtn.onclick = function() {
  loginModal.style.display = 'block';
  loginForm.username.focus();
};
closeLogin.onclick = function() {
  loginModal.style.display = 'none';
  clearLoginMessage();
};
showRegister.onclick = function() {
  loginModal.style.display = 'none';
  registerModal.style.display = 'block';
  registerForm.regUsername.focus();
};
closeRegister.onclick = function() {
  registerModal.style.display = 'none';
  clearRegisterMessage();
};
// Sustituido window.onclick único por listener no destructivo
document.addEventListener('click', function(event) {
  if (event.target === loginModal) {
    loginModal.style.display = 'none';
    clearLoginMessage();
  }
  if (event.target === registerModal) {
    registerModal.style.display = 'none';
    clearRegisterMessage();
  }
  if (event.target === settingsModal) {
    settingsModal.style.display = 'none';
    settingsMessage.textContent = "";
  }
});
window.addEventListener('keydown', function(e){
  if(e.key==="Escape") {
    loginModal.style.display = 'none';
    clearLoginMessage();
    registerModal.style.display = 'none';
    clearRegisterMessage();
    settingsModal.style.display = 'none';
    settingsMessage.textContent = "";
  }
});

// Registro
registerForm.onsubmit = function(e) {
  e.preventDefault();
  const user = registerForm.regUsername.value.trim();
  const pass = registerForm.regPassword.value;
  clearRegisterMessage();

  fetch('http://localhost:4000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      showRegisterMessage("¡Registro exitoso! Ahora inicia sesión.", true);
      setTimeout(() => {
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
        registerForm.reset();
        clearRegisterMessage();
      }, 1300);
    } else {
      showRegisterMessage(data.error || "Error en el registro.");
    }
  }).catch(() => {
    showRegisterMessage("Servidor no disponible. Intenta más tarde.");
  });
};

// Login
loginForm.onsubmit = function(e) {
  e.preventDefault();
  const user = loginForm.username.value.trim();
  const pass = loginForm.password.value;
  clearLoginMessage();

  fetch('http://localhost:4000/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      showLoginMessage("¡Login exitoso! Bienvenido, " + user, true);
      setTimeout(() => {
        loginModal.style.display = 'none';
        loginForm.reset();
        clearLoginMessage();
        cargarUsuario();
      }, 1000);
    } else {
      showLoginMessage(data.error || "Usuario o contraseña incorrectos 💔");
    }
  }).catch(() => {
    showLoginMessage("Servidor no disponible. Intenta más tarde.");
  });
};

// Mostrar usuario logueado arriba derecha y actualizar fecha y badges
async function cargarUsuario() {
  try {
    const res = await fetch('http://localhost:4000/session', {
      credentials: 'include'
    });
    const data = await res.json();
    
    if (data.logged && data.user) {
      userArea.style.display = 'flex';
      userWelcome.textContent = `${data.user.username}`;
      loginHeader.style.display = 'none';
      logoutMenu.style.display = 'none';
      window.userSpecialDate = data.user.special_date ? data.user.special_date.split("T")[0] : null;
      if (specialDateText) specialDateText.textContent = '';
      actualizarContadorDias();
      
      // Cargar mensajes del usuario cuando inicia sesión
      if (window.MessagesModule && window.MessagesModule.Messages) {
        await window.MessagesModule.Messages.loadUserMessages();
      }
    } else {
      userArea.style.display = 'none';
      loginHeader.style.display = '';
      logoutMenu.style.display = 'none';
      window.userSpecialDate = null;
      if (specialDateText) specialDateText.textContent = '';
      actualizarContadorDias();
      
      // Si no hay usuario logueado, usar mensajes por defecto
      if (window.MessagesModule && window.MessagesModule.Messages) {
        window.MessagesModule.Messages.list = [...window.MessagesModule.DEFAULT_MESSAGES];
        window.MessagesModule.Messages.reset();
      }
    }
  } catch (error) {
    console.error('Error al cargar usuario:', error);
  }
}

// Menú de logout/ajustes
userWelcome.onclick = function() {
  logoutMenu.style.display = (logoutMenu.style.display === 'none' || logoutMenu.style.display === '') ? 'block' : 'none';
};
userWelcome.onkeydown = function(e) {
  if (e.key === 'Enter' || e.key === ' ') userWelcome.click();
};
document.addEventListener('click', function(e) {
  if (!userWelcome.contains(e.target) && !logoutMenu.contains(e.target)) {
    logoutMenu.style.display = 'none';
  }
});

// Botón ajustes
settingsBtn.onclick = function() {
  logoutMenu.style.display = 'none';
  settingsModal.style.display = 'block';
  cargarFechaEspecial();
};

// Cerrar ajustes
closeSettings.onclick = function() {
  settingsModal.style.display = 'none';
  settingsMessage.textContent = "";
};

// Cargar fecha especial al abrir ajustes
function cargarFechaEspecial() {
  fetch('http://localhost:4000/special-date', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      if (data.special_date) {
        specialDateInput.value = data.special_date.split('T')[0];
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
      window.userSpecialDate = date; // Actualiza la fecha en variable global
      actualizarContadorDias();      // Recalcula el contador y badges
      setTimeout(() => {
        settingsModal.style.display = 'none';
        settingsMessage.textContent = "";
        cargarUsuario(); // Recarga usuario y todo
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