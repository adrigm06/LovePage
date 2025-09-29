// Variables globales
let youtubePlayer;
let isYouTubePaused = false;
let resumeTimeout;
let notificationTimeout;
let currentMessageIndex = 0;

function setupNightMode() {
  // Crear toggle
  const toggle = document.createElement('div');
  toggle.className = 'theme-toggle';
  toggle.innerHTML = `
    <i class="fas fa-sun sun"></i>
    <i class="fas fa-moon moon"></i>
  `;
  document.body.appendChild(toggle);

  // Manejar el click
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('night-mode');
    localStorage.setItem('nightMode', document.body.classList.contains('night-mode'));
    
    if (document.body.classList.contains('night-mode')) {
      createStars();
    } else {
      removeStars();
    }
  });

  // Cargar preferencia guardada
  if (localStorage.getItem('nightMode') === 'true') {
    document.body.classList.add('night-mode');
    createStars();
  }

  // Crear estrellas iniciales si es modo noche
  if (document.body.classList.contains('night-mode')) {
    createStars();
  }
}

function createStars() {
  // Limpiar estrellas existentes primero
  removeStars();
  
  // Crear contenedor de estrellas si no existe
  let starsContainer = document.querySelector('.stars-container');
  if (!starsContainer) {
    starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';
    document.body.appendChild(starsContainer);
  }
  
  // Crear estrellas
  const starCount = Math.floor(window.innerWidth * window.innerHeight / 5000);
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Tamaño aleatorio entre 1 y 3px
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Posición aleatoria dentro del viewport
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Opacidad y duración aleatoria
    const opacity = Math.random() * 0.8 + 0.2;
    const duration = `${Math.random() * 3 + 2}s`;
    star.style.setProperty('--opacity', opacity);
    star.style.setProperty('--duration', duration);
    
    // Retraso aleatorio
    star.style.animationDelay = `${Math.random() * 5}s`;
    
    starsContainer.appendChild(star);
  }
}

function removeStars() {
  const starsContainer = document.querySelector('.stars-container');
  if (starsContainer) {
    starsContainer.remove();
  }
}

// Llamar a setupNightMode al final de DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Añadir esto al final
  setupNightMode();
});

const things = [
    "La forma en que me apoyas en todo momento",
    "Tu humor",
    "Tus gustos",
    "Tu linda sonrisa",
    "La manera en que cantas",
    "Tus horrendos chistes",
    "Tu pesadez <3",
    "Tus bailes",
    "Tu calidez",
    "Tu sabras ❤️",
    "La manera en que te preocupas",
    "Tu perrito Sky",
    "Los gatetes Macetero, Ruby y Pirata",
    "Tu hermosa mirada",
    "La forma de hacer que cada día sea mejor",
    "La manera en que te interesas por todo lo que se relacione a mi",
    "Tu paciencia conmigo",
    "Tu manera de hacer que me sienta especial",
    "Tu amor incondicional",
    "La forma en que me miras",
    "Tu apoyo",
    "Tu honestidad siempre",
    "Tus chismes",
    "Tu voz",
    "El amor que le das a las cosas",
    "Tu estilo",
    "Los increibles insultos que me dices 😾",
    "Tus venga anda tira",
    "🤍🤍🤍Tu🤍🤍🤍",
    "En fin, solo tengo corazon para ti 🦦"
].filter(msg => msg.trim() !== "");

const romanticMessages = [
    "Tu amor incondicional",
    "La forma en que me miras",
    "Tu hermosa mirada",
    "Tu amor incondicional que me da fuerzas"
];

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // 1. Verificación de sesión y contador de días
    const session = JSON.parse(localStorage.getItem('session'));
    const now = new Date();
    
    if (!session || now.getTime() > session.expiry) {
        localStorage.removeItem('session');
        window.location.href = 'index.html';
        return;
    }

// Contador de días
// Contador de días (versión corregida)
const startDate = new Date('2025-07-18');
startDate.setHours(0, 0, 0, 0); // Fijamos hora a medianoche
const today = new Date();
today.setHours(0, 0, 0, 0); // Fijamos hora a medianoche
const diffTime = today - startDate;
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Días completos
document.getElementById('days').textContent = diffDays;

// Sistema de insignias con emojis
const badgesContainer = document.getElementById('badges');
const totalBadges = 12;
const completedBadges = Math.min(Math.floor(diffDays / 30), totalBadges);

badgesContainer.innerHTML = '';

for (let i = 0; i < totalBadges; i++) {
  const badge = document.createElement('div');
  badge.className = 'badge';
  badge.setAttribute('data-month', i + 1);
  badge.innerHTML = '🍊'; // Emoji de mandarina
  
  if (i < completedBadges) {
    badge.classList.add('completed');
    
    // Efecto especial para la última completada
    if (i === completedBadges - 1) {
      badge.style.animation = 'mandarinaPop 0.6s';
    }
  }
  
  badgesContainer.appendChild(badge);
}

    // 2. Cargar YouTube
    loadYouTubePlayer();

    // 3. Configurar Spotify después de un retraso
    setTimeout(setupSpotifyControls, 1500);

    // 4. Configurar botón de mensajes
    setupMessageButton();
});

// YouTube Player
function loadYouTubePlayer() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function() {
        youtubePlayer = new YT.Player('youtubeAudio', {
            events: {
                'onReady': onYouTubeReady
            }
        });
    };
}

function onYouTubeReady(event) {
    event.target.playVideo();
    
    // Desmutear al hacer click
    document.addEventListener('click', function() {
        if (youtubePlayer && typeof youtubePlayer.unMute === 'function') {
            youtubePlayer.unMute();
        }
    });
}

// Spotify Controls
function setupSpotifyControls() {
    const spotifyContainer = document.querySelector('.spotify-container');
    if (!spotifyContainer) return;

    // Usamos event delegation para manejar clicks
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.spotify-container')) {
            handleSpotifyClick();
        }
    });

    // Escuchar mensajes de Spotify
    window.addEventListener('message', handleSpotifyMessages);
}

function handleSpotifyClick() {
    if (youtubePlayer && typeof youtubePlayer.pauseVideo === 'function') {
        youtubePlayer.pauseVideo();
        isYouTubePaused = true;
        
        cancelResume();
        
        resumeTimeout = setTimeout(() => {
            if (isYouTubePaused) {
                youtubePlayer.playVideo();
                isYouTubePaused = false;
                showNotification("Música de fondo reanudada");
            }
        }, 5000);
    }
}

function handleSpotifyMessages(e) {
    if (e.origin === 'https://open.spotify.com' && e.data.type === 'playback_started' && youtubePlayer) {
        youtubePlayer.pauseVideo();
        isYouTubePaused = true;
        cancelResume();
    }
}

function cancelResume() {
    if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
    }
}

// Sistema de notificaciones
function showNotification(message) {
    let notification = document.getElementById('music-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'music-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#E91E63';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '50px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        notification.style.zIndex = '1000';
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
    
    if (notificationTimeout) clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
    }, 3000);
}

// Configuración del botón de mensajes
function setupMessageButton() {
    const messageBox = document.getElementById('randomMessage');
    const showBtn = document.getElementById('showBtn');
    
    if (!messageBox || !showBtn) return;

    // Initial animation
    setTimeout(() => {
        messageBox.style.transition = 'all 0.8s ease';
    }, 1000);

    showBtn.addEventListener('click', () => {
        // Verificar si ya se mostraron todos los mensajes
        if (currentMessageIndex >= things.length) {
            return;
        }

        // Animación
        messageBox.style.opacity = '0';
        messageBox.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            const message = things[currentMessageIndex];
            messageBox.textContent = message;
            messageBox.style.opacity = '1';
            messageBox.style.transform = 'translateY(0)';
            createHearts();
            
            // Verificar si es un mensaje romántico para el efecto de latido
            checkHeartbeat(message);
            
            currentMessageIndex++;
            
            if (currentMessageIndex >= things.length) {
                // Desactivar el botón inmediatamente al llegar al último mensaje
                disableButtonNow();
                
                // Esperar 3 segundos antes de mostrar el mensaje final
                setTimeout(showFinalMessage, 3000);
            }
        }, 300);
    });
}

// Nueva función para desactivar el botón inmediatamente
function disableButtonNow() {
    const showBtn = document.getElementById('showBtn');
    if (!showBtn) return;
    
    showBtn.disabled = true;
    showBtn.classList.add('btn-disabled');
    showBtn.innerHTML = '<i class="fas fa-heart" style="margin-right: 10px;"></i>¡Completado!';
}

// Nueva función para mostrar el mensaje final después de 3 segundos
function showFinalMessage() {
    const messageBox = document.getElementById('randomMessage');
    if (!messageBox) return;

    messageBox.style.opacity = '0';
    messageBox.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        messageBox.textContent = "Y muchas más cosas mas... Gracias por ser tu ❤️";
        messageBox.style.opacity = '1';
        messageBox.style.transform = 'translateY(0)';
        
        // Efecto especial de corazones al completar
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

/*RECORDATORIOS*/
// En la página de recordatorios, calcular días hasta la próxima ocurrencia
if (document.querySelector('.dates-container')) {
  document.querySelectorAll('.days-counter').forEach(counter => {
    const targetDateStr = counter.dataset.date;
    const now = new Date();
    
    // Para fechas sin año (como cumpleaños)
    if (targetDateStr.split('-').length === 2) {
      const [month, day] = targetDateStr.split('-');
      let nextDate = new Date(now.getFullYear(), month - 1, day);
      
      // Si ya pasó este año, calcular para el próximo año
      if (nextDate < now) {
        nextDate = new Date(now.getFullYear() + 1, month - 1, day);
      }
      
      calculateDaysDifference(counter, nextDate);
    } 
    // Para fechas con año específico (como aniversarios)
    else {
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
    // Nuestro Primer Día: día 18 de cada mes
    const day = parseInt(dateParts[2] || '18');
    targetDate = new Date(now.getFullYear(), now.getMonth(), day);
    if (targetDate < now) {
        // Ir al 18 del mes siguiente si ya pasó
        targetDate = new Date(now.getFullYear(), now.getMonth() + 1, day);
    }
  } else {
    // Eventos anuales: usar MM-DD y comparar con hoy
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    targetDate = new Date(now.getFullYear(), month, day);
    if (targetDate < now) {
      // Ir al año siguiente si ya pasó este año
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

// Crear burbujas flotantes
function createBubbles() {
  // Solo crear burbujas si estamos en modo claro
  if (!document.body.classList.contains('night-mode')) {
    const bubbleCount = 5;
    
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      // Posiciones iniciales aleatorias
      bubble.style.left = `${Math.random() * 90 + 5}%`;
      bubble.style.top = `${Math.random() * 90 + 5}%`;
      
      // Tamaños aleatorios entre 15px y 40px
      const size = Math.random() * 25 + 15;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Duración de animación aleatoria
      bubble.style.animationDuration = `${Math.random() * 15 + 15}s`;
      bubble.style.animationDelay = `${Math.random() * 10}s`;
      
      document.body.appendChild(bubble);
    }
  }
}

// Llamar a la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', createBubbles);

// Actualizar burbujas al cambiar de modo
document.querySelector('.theme-toggle')?.addEventListener('click', function() {
  setTimeout(() => {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => bubble.remove());
    
    if (!document.body.classList.contains('night-mode')) {
      createBubbles();
    }
  }, 500); // Esperar a que termine la transición de modo
});

function createBubbles() {
  if (!document.body.classList.contains('night-mode') && 
      document.querySelectorAll('.bubble').length === 0) {
      
    const sizes = [160, 220, 240, 280]; // Tamaños variados pero no extremos
    const positions = [
      { left: "15%", top: "25%" },  // No tan cerca del borde
      { left: "75%", top: "35%" },
      { left: "25%", top: "65%" },
      { left: "70%", top: "75%" }
    ];
    
    sizes.forEach((size, index) => {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = positions[index].left;
      bubble.style.top = positions[index].top;
      
      // Duración intermedia (20-28s) + delays aleatorios
      bubble.style.animationDuration = `${Math.random() * 8 + 20}s`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      
      document.body.appendChild(bubble);
    });
  }
}

// Eliminar burbujas en modo noche (igual que antes)
function removeBubbles() {
  document.querySelectorAll('.bubble').forEach(bubble => bubble.remove());
}

// Inicializar
document.addEventListener('DOMContentLoaded', createBubbles);

// Cambiar entre modos
document.querySelector('.theme-toggle')?.addEventListener('click', function() {
  setTimeout(() => {
    if (document.body.classList.contains('night-mode')) {
      removeBubbles();
    } else {
      createBubbles();
    }
  }, 500);
});