/* ============================================
	GALLERY.JS - Gestión de la galería de fotos
	Contenido: Efectos 3D, lazy loading, modal de imágenes y animaciones
   ============================================ */

/* === CONFIGURACIÓN === */
const GALLERY_CONFIG = {
	selector: '.photo-frame',
	imageSelector: '.photo-image',
	captionSelector: '.photo-caption',
	placeholderSelector: '.photo-placeholder'
};

/* === EFECTOS DE HOVER 3D === */
function setupGalleryEffects() {
	const frames = document.querySelectorAll(GALLERY_CONFIG.selector);
	
	frames.forEach(frame => {
		const img = frame.querySelector(GALLERY_CONFIG.imageSelector);
		
		if (!img) return;
		
		// Efecto de inclinación 3D al mover el mouse
		frame.addEventListener('mousemove', (e) => {
			const rect = frame.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			
			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			
			// Calcular ángulos de rotación basados en posición del mouse
			const rotateX = (y - centerY) / 10;
			const rotateY = (centerX - x) / 10;
			
			frame.style.transform = `
				perspective(1000px) 
				rotateX(${rotateX}deg) 
				rotateY(${rotateY}deg) 
				scale(1.05)
			`;
		});
		
		// Restaurar estado original al salir del hover
		frame.addEventListener('mouseleave', () => {
			const index = Array.from(frames).indexOf(frame);
			const originalRotation = index % 2 === 0 ? 'rotate(3deg)' : 'rotate(-3deg)';
			
			frame.style.transform = `${originalRotation} translateY(8px)`;
		});
	});
}

/* === LAZY LOADING DE IMÁGENES === */
function setupLazyLoading() {
	const images = document.querySelectorAll(GALLERY_CONFIG.imageSelector);
	
	// Verificar soporte del navegador para IntersectionObserver
	if ('IntersectionObserver' in window) {
		const imageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target;
					
					// Solo cargar si tiene data-src y no se ha cargado aún
					if (img.dataset.src && !img.src) {
						img.src = img.dataset.src;
						img.removeAttribute('data-src');
						observer.unobserve(img);
					}
				}
			});
		});
		
		images.forEach(img => imageObserver.observe(img));
	}
}

/* === MODAL DE IMAGEN AMPLIADA (OPCIONAL) === */
function setupImageModal() {
	const frames = document.querySelectorAll(GALLERY_CONFIG.selector);
	
	frames.forEach(frame => {
		const img = frame.querySelector(GALLERY_CONFIG.imageSelector);
		
		if (!img) return;
		
		// Click en el frame abre el modal
		frame.addEventListener('click', () => {
			createImageModal(img.src, img.alt);
		});
	});
}

function createImageModal(src, alt) {
	// Reutilizar modal existente o crear uno nuevo
	let modal = document.getElementById('image-modal');
	
	if (!modal) {
		modal = document.createElement('div');
		modal.id = 'image-modal';
		modal.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.9);
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 10000;
			cursor: pointer;
		`;
		
		const img = document.createElement('img');
		img.style.cssText = `
			max-width: 90%;
			max-height: 90%;
			border-radius: 10px;
			box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
		`;
		
		modal.appendChild(img);
		document.body.appendChild(modal);
		
		// Cerrar al hacer clic en el modal
		modal.addEventListener('click', () => {
			modal.style.display = 'none';
		});
		
		// Cerrar con tecla ESC
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				modal.style.display = 'none';
			}
		});
	}
	
	// Actualizar imagen del modal
	const img = modal.querySelector('img');
	img.src = src;
	img.alt = alt || 'Foto ampliada';
	modal.style.display = 'flex';
}

/* === ANIMACIÓN DE ENTRADA (OPCIONAL, Inacabado) === */
/*function animateGalleryEntrance() {
	const frames = document.querySelectorAll(GALLERY_CONFIG.selector);
	
	frames.forEach((frame, index) => {
		// Estado inicial (oculto y desplazado)
		frame.style.opacity = '0';
		frame.style.transform = 'translateY(50px)';
		
		// Animar entrada con delay escalonado
		setTimeout(() => {
			frame.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
			frame.style.opacity = '1';
			
			// Rotación alternada según índice
			const rotation = index % 2 === 0 ? 'rotate(3deg)' : 'rotate(-3deg)';
			frame.style.transform = `${rotation} translateY(8px)`;
		}, index * 100);
	});
}*/

/* === INICIALIZACIÓN === */
document.addEventListener('DOMContentLoaded', () => {
	setupGalleryEffects();
	setupLazyLoading();
	setupImageModal(); // Comentar si se activa hover antiguo
	// animateGalleryEntrance(); // Descomentar para habilitar animación
});

/* === EXPORTAR FUNCIONES === */
window.GalleryModule = {
	setupGalleryEffects,
	setupLazyLoading,
	setupImageModal,
	//animateGalleryEntrance,
	createImageModal
};
