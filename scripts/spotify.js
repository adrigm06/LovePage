/* ============================================
    SPOTIFY.JS - Integración con Spotify
   ============================================ */

// === CARGAR PLAYLIST DE SPOTIFY ===
function loadSpotifyPlaylist() {
  const iframe = document.querySelector('.spotify-container iframe');
  if (!iframe) return;
  
  fetch('http://localhost:4000/spotify-playlist', { 
    credentials: 'include' 
  })
    .then(res => res.json())
    .then(data => {
      const playlist = data.playlist;
      
      if (playlist && playlist.length > 10) {
        let embedUrl = playlist;
        
        // Convertir a formato embed si es necesario
        if (playlist.includes('/playlist/') && !playlist.includes('/embed/')) {
          embedUrl = playlist.replace('/playlist/', '/embed/playlist/');
        }
        
        iframe.src = embedUrl;
      }
    })
    .catch(err => {
      console.error('Error al cargar playlist de Spotify:', err);
    });
}

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', loadSpotifyPlaylist);

// === EXPORTAR ===
window.SpotifyModule = {
  loadSpotifyPlaylist
};
