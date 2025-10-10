/* ============================================
    Contenido: Burbujas, estrellas, corazones
   ============================================ */

// === BURBUJAS FLOTANTES ===
function createBubbles() {
  // Limpiar burbujas existentes
    document.querySelectorAll('.bubble').forEach(bubble => bubble.remove());

  // Burbujas grandes (4 fijas)
    const bigSizes = [160, 220, 240, 280];
    const bigPositions = [
        { left: "15%", top: "25%" },
        { left: "75%", top: "35%" },
        { left: "25%", top: "65%" },
        { left: "70%", top: "75%" }
    ];
    bigSizes.forEach((size, idx) => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = bigPositions[idx].left;
        bubble.style.top = bigPositions[idx].top;
        bubble.style.animationDuration = `${Math.random() * 8 + 20}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        document.body.appendChild(bubble);
    });

  // Burbujas pequeñas (10 aleatorias)
    for (let i = 0; i < 10; i++) {
        const size = Math.random() * 20 + 10;
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 90 + 2}%`;
        bubble.style.top = `${Math.random() * 90 + 2}%`;
        bubble.style.animationDuration = `${Math.random() * 10 + 15}s`;
        bubble.style.animationDelay = `${Math.random() * 10}s`;
        document.body.appendChild(bubble);
    }
    }

function removeBubbles() {
    document.querySelectorAll('.bubble').forEach(bubble => bubble.remove());
}

// === ESTRELLAS (MODO NOCTURNO) ===
function createStars() {
    removeStars();
    
    let starsContainer = document.querySelector('.stars-container');
    if (!starsContainer) {
        starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        document.body.appendChild(starsContainer);
    } else {
        starsContainer.innerHTML = '';
    }
    
        // Reducir ligeramente la densidad de estrellas para minimizar repaints en scroll
        const area = window.innerWidth * window.innerHeight;
        const base = Math.floor(area / 5500);
        // Limitar mínimo/máximo razonable
        const starCount = Math.max(60, Math.min(300, base));
    const fragment = document.createDocumentFragment();
    
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
        
        fragment.appendChild(star);
    }
    
    starsContainer.appendChild(fragment);
}

function removeStars() {
    const starsContainer = document.querySelector('.stars-container');
    if (starsContainer) starsContainer.remove();
}

// === CORAZONES FLOTANTES ===
function createHearts() {
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = '70%';
        heart.style.animationDuration = `${1.2 + Math.random() * 1.3}s`;
        heart.style.setProperty('--delay', `${Math.random() * 2}s`);
        heart.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        
        fragment.appendChild(heart);
        
        setTimeout(() => {
        heart.remove();
        }, 2500);
    }
    
    document.body.appendChild(fragment);
}

// === INDICADOR DE LATIDO ===
function ensureHeartbeatIndicator() {
    if (!document.querySelector('.heartbeat-indicator')) {
        const el = document.createElement('div');
        el.className = 'heartbeat-indicator';
        document.body.appendChild(el);
    }
}

function checkHeartbeat(message) {
    const heartbeatWords = ['amor', 'corazón', 'te amo', 'te quiero'];
    const shouldActivate = heartbeatWords.some(word => 
        message.toLowerCase().includes(word)
    );
    
    if (shouldActivate) {
        document.body.classList.add('heartbeat-active');
        setTimeout(() => {
        document.body.classList.remove('heartbeat-active');
        }, 3000);
    }
}

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
    ensureHeartbeatIndicator();
});

// === EXPORTAR FUNCIONES ===
window.AnimationsModule = {
    createBubbles,
    removeBubbles,
    createStars,
    removeStars,
    createHearts,
    ensureHeartbeatIndicator,
    checkHeartbeat
};
