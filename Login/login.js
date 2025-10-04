// --- Utilidades de mensajes ---
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

// --- Elementos ---
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

// --- Mostrar/Ocultar modals ---
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
};
window.addEventListener('keydown', function(e){
  if(e.key==="Escape") {
    loginModal.style.display = 'none';
    clearLoginMessage();
    registerModal.style.display = 'none';
    clearRegisterMessage();
  }
});

// --- Registro ---
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

// --- Login ---
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

// --- Mostrar usuario logueado y menú logout ---
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
      logoutMenu.style.display = 'none'; // Oculta el menú al cargar
    } else {
      userArea.style.display = 'none';
      loginHeader.style.display = '';
      logoutMenu.style.display = 'none';
    }
  });
}

// Mostrar menú logout al hacer click en el usuario
userWelcome.onclick = function() {
  if (logoutMenu.style.display === 'none' || logoutMenu.style.display === '') {
    logoutMenu.style.display = 'block';
  } else {
    logoutMenu.style.display = 'none';
  }
};

// También mostrar el menú con Enter (accesibilidad)
userWelcome.onkeydown = function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    userWelcome.click();
  }
};

// Ocultar el menú logout si se hace click fuera
document.addEventListener('click', function(e) {
  if (!userWelcome.contains(e.target) && !logoutMenu.contains(e.target)) {
    logoutMenu.style.display = 'none';
  }
});

// --- Logout ---
logoutBtn.onclick = function() {
  fetch('http://localhost:4000/logout', {
    method: 'POST',
    credentials: 'include'
  }).then(() => {
    userArea.style.display = 'none';
    loginHeader.style.display = '';
    logoutMenu.style.display = 'none';
  });
};

// --- Al cargar la página ---
// window.onload = function() {
//   cargarUsuario();
// };
document.addEventListener('DOMContentLoaded', cargarUsuario);