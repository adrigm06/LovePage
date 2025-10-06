// Variables globales para mensajes y efectos visuales
let currentMessageIndex = 0;

// --- Modo noche ---
function setupNightMode() {
  const toggle = document.createElement('div');
  toggle.className = 'theme-toggle';
  toggle.innerHTML = `
    <i class="fas fa-sun sun"></i>
    <i class="fas fa-moon moon"></i>
  `;
  document.body.appendChild(toggle);

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('night-mode');
    localStorage.setItem('nightMode', document.body.classList.contains('night-mode'));
    if (document.body.classList.contains('night-mode')) {
      createStars();
    } else {
      removeStars();
    }
  });

  if (localStorage.getItem('nightMode') === 'true') {
    document.body.classList.add('night-mode');
    createStars();
  }
  if (document.body.classList.contains('night-mode')) {
    createStars();
  }
}
function createStars() {
  removeStars();
  let starsContainer = document.querySelector('.stars-container');
  if (!starsContainer) {
    starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);
  }
  const starCount = Math.floor(window.innerWidth * window.innerHeight / 5000);
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const opacity = Math.random() * 0.8 + 0.2;
    const duration = `${Math.random() * 3 + 2}s`;
    star.style.setProperty('--opacity', opacity);
    star.style.setProperty('--duration', duration);
    star.style.animationDelay = `${Math.random() * 5}s`;
    starsContainer.appendChild(star);
  }
}
function removeStars() {
  const starsContainer = document.querySelector('.stars-container');
  if (starsContainer) starsContainer.remove();
}
document.addEventListener('DOMContentLoaded', setupNightMode);

// --- CONTADOR DE DÍAS PERSONALIZADO ---
function getSpecialDate() {
  return window.userSpecialDate ? window.userSpecialDate : "2025-07-18";
}
function actualizarContadorDias() {
  const startDate = new Date(getSpecialDate());
  startDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = today - startDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysSpan = document.getElementById('days');
  if (daysSpan) daysSpan.textContent = diffDays;

  const badgesContainer = document.getElementById('badges');
  if (badgesContainer) {
    const totalBadges = 12;
    const completedBadges = Math.min(Math.floor(diffDays / 30), totalBadges);
    badgesContainer.innerHTML = '';
    for (let i = 0; i < totalBadges; i++) {
      const badge = document.createElement('div');
      badge.className = 'badge';
      badge.setAttribute('data-month', i + 1);
      badge.innerHTML = '🍊';
      if (i < completedBadges) {
        badge.classList.add('completed');
        if (i === completedBadges - 1) {
          badge.style.animation = 'mandarinaPop 0.6s';
        }
      }
      badgesContainer.appendChild(badge);
    }
  }
}
document.addEventListener('DOMContentLoaded', actualizarContadorDias);
window.actualizarContadorDias = actualizarContadorDias;

// --- Mensajes especiales ---
const things = [
  "Tu sonrisa ilumina mis días",
  "Siempre encuentras la manera de animarme",
  "Tu abrazo es mi refugio favorito",
  "Admiro tu fuerza y tu bondad",
  "Tu risa es la melodía que más me gusta escuchar",
  "Me encanta compartir cada momento contigo",
  "Tu forma de ver la vida me inspira",
  "Gracias por estar siempre a mi lado",
  "Eres mi mejor apoyo y mi mejor amigo/a",
  "Cada día contigo es un regalo",
  "Me haces sentir amado/a y especial",
  "Tus palabras me llenan de paz",
  "Tu amor me da fuerzas para todo",
  "Contigo todo es más bonito",
  "Me encanta que compartas tus sueños conmigo",
  "Tu ternura es infinita",
  "Tu compañía es mi lugar favorito",
  "Me haces reír incluso en los días grises",
  "Siempre sabes cómo sorprenderme",
  "Eres mi hogar y mi aventura",
  "Gracias por cuidar de mí",
  "Adoro tus detalles y tu creatividad",
  "Nuestro amor crece cada día",
  "Me siento afortunado/a de tenerte",
  "Tu forma de amar me inspira a ser mejor",
  "Contigo aprendí lo que es la felicidad",
  "Siempre eres mi razón para sonreír",
  "El mundo es más bonito contigo",
  "Tu mirada me llena de calma",
  "Solo tengo ojos para ti",
  "Por muchos momentos juntos más"
].filter(msg => msg.trim() !== "");

const romanticMessages = [
  "Tu amor incondicional",
  "La forma en que me miras",
  "Tu hermosa mirada",
  "Tu amor incondicional que me da fuerzas"
];

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(setupSpotifyControls, 1500);
  setupMessageButton();
});

function setupSpotifyControls() {
  const spotifyContainer = document.querySelector('.spotify-container');
  if (!spotifyContainer) return;
  document.body.addEventListener('click', function(e) {
    if (e.target.closest('.spotify-container')) {
      handleSpotifyClick();
    }
  });
}

// --- Mensajes y corazones ---
function setupMessageButton() {
  const messageBox = document.getElementById('randomMessage');
  const showBtn = document.getElementById('showBtn');
  if (!messageBox || !showBtn) return;

  setTimeout(() => {
    messageBox.style.transition = 'all 0.8s ease';
  }, 1000);

  showBtn.addEventListener('click', () => {
    if (currentMessageIndex >= things.length) return;
    messageBox.style.opacity = '0';
    messageBox.style.transform = 'translateY(20px)';
    setTimeout(() => {
      const message = things[currentMessageIndex];
      messageBox.textContent = message;
      messageBox.style.opacity = '1';
      messageBox.style.transform = 'translateY(0)';
      createHearts();
      checkHeartbeat(message);
      currentMessageIndex++;
      if (currentMessageIndex >= things.length) {
        disableButtonNow();
        setTimeout(showFinalMessage, 3000);
      }
    }, 300);
  });
}
function disableButtonNow() {
  const showBtn = document.getElementById('showBtn');
  if (!showBtn) return;
  showBtn.disabled = true;
  showBtn.classList.add('btn-disabled');
  showBtn.innerHTML = '<i class="fas fa-heart" style="margin-right: 10px;"></i>¡Completado!';
}
function showFinalMessage() {
  const messageBox = document.getElementById('randomMessage');
  if (!messageBox) return;
  messageBox.style.opacity = '0';
  messageBox.style.transform = 'translateY(20px)';
  setTimeout(() => {
    messageBox.textContent = "Y muchas más cosas mas... Gracias por ser tu ❤️";
    messageBox.style.opacity = '1';
    messageBox.style.transform = 'translateY(0)';
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        createHearts();
      }, i * 100);
    }
  }, 300);
}
function createHearts() {
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = '70%';
    heart.style.animationDuration = `${1.2 + Math.random() * 1.3}s`;
    heart.style.setProperty('--delay', `${Math.random() * 2}s`);
    heart.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    document.body.appendChild(heart);
    setTimeout(() => {
      heart.remove();
    }, 2500);
  }
}
function checkHeartbeat(message) {
  if (romanticMessages.includes(message)) {
    document.body.classList.add('heartbeat-active');
    setTimeout(() => {
      document.body.classList.remove('heartbeat-active');
    }, 3000);
  }
}

// --- RECORDATORIOS ---
// En la página de recordatorios, calcular días hasta la próxima ocurrencia
if (document.querySelector('.dates-container')) {
  document.querySelectorAll('.days-counter').forEach(counter => {
    const targetDateStr = counter.dataset.date;
    const now = new Date();
    if (targetDateStr.split('-').length === 2) {
      const [month, day] = targetDateStr.split('-');
      let nextDate = new Date(now.getFullYear(), month - 1, day);
      if (nextDate < now) {
        nextDate = new Date(now.getFullYear() + 1, month - 1, day);
      }
      calculateDaysDifference(counter, nextDate);
    } else {
      const targetDate = new Date(targetDateStr);
      calculateDaysDifference(counter, targetDate);
    }
  });
}
function calculateDaysDifference(counter, originalDate) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dateParts = counter.dataset.date.split('-');
  let targetDate;
  if (counter.dataset.type === 'monthly') {
    const day = parseInt(dateParts[2] || '18');
    targetDate = new Date(now.getFullYear(), now.getMonth(), day);
    if (targetDate < now) {
      targetDate = new Date(now.getFullYear(), now.getMonth() + 1, day);
    }
  } else {
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    targetDate = new Date(now.getFullYear(), month, day);
    if (targetDate < now) {
      targetDate = new Date(now.getFullYear() + 1, month, day);
    }
  }
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate - now;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    counter.textContent = '¡Es hoy!';
    counter.style.color = '#4CAF50';
    counter.parentElement.parentElement.style.background = 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)';
    counter.parentElement.parentElement.style.color = 'white';
    counter.parentElement.querySelector('h3').style.color = 'white';
    counter.parentElement.querySelector('.date').style.color = 'rgba(255,255,255,0.9)';
  } else {
    counter.textContent = `Faltan ${diffDays} ${Math.abs(diffDays) === 1 ? 'día' : 'días'}`;
    counter.style.color = '#E91E63';
  }
}

// --- Burbuja flotante ---
function createBubbles() {
  if (!document.body.classList.contains('night-mode')) {
    const bubbleCount = 5;
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.style.left = `${Math.random() * 90 + 5}%`;
      bubble.style.top = `${Math.random() * 90 + 5}%`;
      const size = Math.random() * 25 + 15;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.animationDuration = `${Math.random() * 15 + 15}s`;
      bubble.style.animationDelay = `${Math.random() * 10}s`;
      document.body.appendChild(bubble);
    }
  }
}
document.addEventListener('DOMContentLoaded', createBubbles);

document.querySelector('.theme-toggle')?.addEventListener('click', function() {
  setTimeout(() => {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => bubble.remove());
    if (!document.body.classList.contains('night-mode')) {
      createBubbles();
    }
  }, 500);
});
function removeBubbles() {
  document.querySelectorAll('.bubble').forEach(bubble => bubble.remove());
}
document.addEventListener('DOMContentLoaded', createBubbles);
document.querySelector('.theme-toggle')?.addEventListener('click', function() {
  setTimeout(() => {
    if (document.body.classList.contains('night-mode')) {
      removeBubbles();
    } else {
      createBubbles();
    }
  }, 500);
});