/* ============================================
   MESSAGES.JS - Sistema de mensajes bonitos
   ============================================ */

// === GESTIÓN DE MENSAJES ===
let currentMessageIndex = 0;

const Messages = {
  list: [
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
  ],
  
  next() {
    if (currentMessageIndex >= this.list.length) return null;
    return this.list[currentMessageIndex++];
  },
  
  remaining() { 
    return this.list.length - currentMessageIndex; 
  },
  
  isComplete() {
    return currentMessageIndex >= this.list.length;
  }
};

// === CONFIGURACIÓN DEL BOTÓN DE MENSAJES ===
function setupMessageButton() {
  const messageBox = document.getElementById('randomMessage');
  const showBtn = document.getElementById('showBtn');
  
  if (!messageBox || !showBtn) return;

  // Agregar transición después de un momento
  setTimeout(() => {
    messageBox.style.transition = 'all 0.8s ease';
  }, 1000);

  showBtn.addEventListener('click', () => {
    if (Messages.isComplete()) return;
    
    // Animación de salida
    messageBox.style.opacity = '0';
    messageBox.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      const message = Messages.next();
      if (message === null) return;
      
      // Mostrar nuevo mensaje
      messageBox.textContent = message;
      messageBox.style.opacity = '1';
      messageBox.style.transform = 'translateY(0)';
      
      // Efectos visuales
      if (window.AnimationsModule) {
        window.AnimationsModule.createHearts();
        window.AnimationsModule.checkHeartbeat(message);
      }
      
      // Verificar si se completaron todos los mensajes
      if (Messages.isComplete()) {
        disableButton();
        setTimeout(showFinalMessage, 3000);
      }
    }, 300);
  });
}

// === DESHABILITAR BOTÓN ===
function disableButton() {
  const showBtn = document.getElementById('showBtn');
  if (!showBtn) return;
  
  showBtn.disabled = true;
  showBtn.classList.add('btn-disabled');
  showBtn.innerHTML = '<i class="fas fa-heart" style="margin-right: 10px;"></i>¡Completado!';
}

// === MENSAJE FINAL ===
function showFinalMessage() {
  const messageBox = document.getElementById('randomMessage');
  if (!messageBox) return;
  
  messageBox.style.opacity = '0';
  messageBox.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    messageBox.textContent = "Y muchas más cosas más... Gracias por ser tú ❤️";
    messageBox.style.opacity = '1';
    messageBox.style.transform = 'translateY(0)';
    
    // Explosión de corazones
    if (window.AnimationsModule) {
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          window.AnimationsModule.createHearts();
        }, i * 100);
      }
    }
  }, 300);
}

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', setupMessageButton);

// === EXPORTAR ===
window.MessagesModule = {
  Messages,
  setupMessageButton,
  disableButton,
  showFinalMessage
};
