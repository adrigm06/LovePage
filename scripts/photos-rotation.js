/* ============================================
    PHOTOS-ROTATION.JS - Rotación dinámica de fotos
    Contenido: Sistema de rotación basado en fechas
   ============================================ */

(function() {
	/* === CONFIGURACIÓN === */
	const BASE_PATH = 'img/';
	const JSON_FILE = 'photos.json';
	const FRAMES_SELECTOR = '.photo-gallery .photo-image';
	const START_DATE = '2025-07-18';
	const STEP = 4; // Número de fotos que cambian por día

	/* === INICIALIZACIÓN === */
	document.addEventListener('DOMContentLoaded', initPhotoRotation);

	/* === INICIALIZAR ROTACIÓN DE FOTOS === */
	async function initPhotoRotation() {
		const frames = Array.from(document.querySelectorAll(FRAMES_SELECTOR));
		if (frames.length === 0) return;

		// Cargar lista de fotos desde JSON
		let photos = [];
		try {
			photos = await loadPhotoList();
		} catch (e) {
			console.error('No se pudo cargar img/photos.json', e);
			return;
		}

		// Filtrar y validar nombres de archivos
		photos = photos
			.filter(Boolean)
			.map(String)
			.filter(name => /\.(jpe?g|png|webp|gif)$/i.test(name));

		if (photos.length === 0) {
			console.warn('img/photos.json no contiene nombres de imagen válidos.');
			return;
		}
		
		// Calcular índice base según la fecha actual
		const baseIndex = computeBaseIndexByDate(new Date(), photos.length, STEP);
		setFrameImages(frames, photos, baseIndex);
	}

	/* === CARGAR LISTA DE FOTOS DESDE JSON === */
	async function loadPhotoList() {
		const res = await fetch(`${BASE_PATH}${JSON_FILE}`, { cache: 'no-store' });
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		// Soportar tanto array directo como objeto con propiedad 'photos'
		return Array.isArray(data) ? data : (Array.isArray(data.photos) ? data.photos : []);
	}

	/* === CALCULAR ÍNDICE BASE SEGÚN FECHA === */
	function computeBaseIndexByDate(date, total, step) {
		const start = new Date(START_DATE);
		start.setHours(0, 0, 0, 0);

		const d = new Date(date);
		d.setHours(0, 0, 0, 0);

		// Calcular días transcurridos desde la fecha inicial
		const diffDays = Math.floor((d - start) / 86400000);
		return mod(diffDays * step, total);
	}

	/* === ASIGNAR IMÁGENES A LOS FRAMES === */
	function setFrameImages(frames, photos, baseIndex) {
		for (let i = 0; i < frames.length; i++) {
			const idx = mod(baseIndex + i, photos.length);
			const src = `${BASE_PATH}${photos[idx]}`;
			const img = frames[i];
			// Solo actualizar si la imagen cambió
			if (img.getAttribute('src') !== src) {
				img.src = src;
				img.alt = photos[idx];
			}
		}
	}

	/* === MÓDULO MATEMÁTICO (SIEMPRE POSITIVO) === */
	function mod(n, m) {
		return ((n % m) + m) % m;
	}
})();