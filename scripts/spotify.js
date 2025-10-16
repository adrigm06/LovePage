/* ============================================
	SPOTIFY.JS - Integración con Spotify
	Contenido: Carga dinámica de playlist del usuario
   ============================================ */

/* === CARGAR PLAYLIST DE SPOTIFY === */
function loadSpotifyPlaylist() {
	const iframe = document.querySelector('.spotify-container iframe');
	if (!iframe) return;
	
	fetch('http://localhost:4000/spotify-playlist', { 
		credentials: 'include' 
	})
		.then(res => {
			if (!res.ok) {
				// Si no está autenticado o hay error, mantener playlist por defecto
				console.warn('No se pudo cargar playlist personalizada, usando playlist por defecto');
				return null;
			}
			return res.json();
		})
		.then(data => {
			if (!data) return; // No hay datos, mantener iframe por defecto
			
			const playlist = data.playlist;
			
			// Verificar que la URL tenga contenido válido
			if (playlist && playlist.length > 10) {
				let embedUrl = playlist;
				
				// Convertir URL normal a formato embed si es necesario
				if (playlist.includes('/playlist/') && !playlist.includes('/embed/')) {
					embedUrl = playlist.replace('/playlist/', '/embed/playlist/');
				}
				
				iframe.src = embedUrl;
			}
		})
		.catch(err => {
			console.warn('Error al cargar playlist de Spotify, usando playlist por defecto:', err);
		});
}

/* === INICIALIZACIÓN === */
document.addEventListener('DOMContentLoaded', loadSpotifyPlaylist);

/* === EXPORTAR FUNCIONES === */
window.SpotifyModule = {
	loadSpotifyPlaylist
};
