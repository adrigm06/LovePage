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
window.onclick = function(event) {
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
};
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
function cargarUsuario() {
  fetch('http://localhost:4000/session', {
    credentials: 'include'
  })
  .then(res => res.json())
  .then(data => {
    if (data.logged && data.user) {
      userArea.style.display = 'flex';
      userWelcome.textContent = `${data.user.username}`;
      loginHeader.style.display = 'none';
      logoutMenu.style.display = 'none';
      window.userSpecialDate = data.user.special_date ? data.user.special_date.split("T")[0] : null;
      if (specialDateText) specialDateText.textContent = '';
      actualizarContadorDias();
    } else {
      userArea.style.display = 'none';
      loginHeader.style.display = '';
      logoutMenu.style.display = 'none';
      window.userSpecialDate = null;
      if (specialDateText) specialDateText.textContent = '';
      actualizarContadorDias();
    }
  });
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
      settingsMessage.textContent = "¡Fecha actualizada!";
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
  });
};

// Al cargar la página, mostrar usuario y contador si está logueado
document.addEventListener('DOMContentLoaded', cargarUsuario);