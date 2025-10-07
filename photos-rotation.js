(function() {
  const BASE_PATH = 'img/';
  const JSON_FILE = 'photos.json';
  const FRAMES_SELECTOR = '.photo-gallery .photo-image';
  const START_DATE = '2025-07-18';
  const STEP = 4;

  document.addEventListener('DOMContentLoaded', initPhotoRotation);

  async function initPhotoRotation() {
    const frames = Array.from(document.querySelectorAll(FRAMES_SELECTOR));
    if (frames.length === 0) return;

    let photos = [];
    try {
      photos = await loadPhotoList();
    } catch (e) {
      console.error('No se pudo cargar img/photos.json', e);
      return;
    }

    photos = photos
      .filter(Boolean)
      .map(String)
      .filter(name => /\.(jpe?g|png|webp|gif)$/i.test(name));

    if (photos.length === 0) {
      console.warn('img/photos.json no contiene nombres de imagen válidos.');
      return;
    }
    const baseIndex = computeBaseIndexByDate(new Date(), photos.length, STEP);
    setFrameImages(frames, photos, baseIndex);
  }

  async function loadPhotoList() {
    const res = await fetch(`${BASE_PATH}${JSON_FILE}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (Array.isArray(data.photos) ? data.photos : []);
  }

  function computeBaseIndexByDate(date, total, step) {
    const start = new Date(START_DATE);
    start.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((d - start) / 86400000);
    return mod(diffDays * step, total);
  }

  function setFrameImages(frames, photos, baseIndex) {
    for (let i = 0; i < frames.length; i++) {
      const idx = mod(baseIndex + i, photos.length);
      const src = `${BASE_PATH}${photos[idx]}`;  // 
      const img = frames[i];
      if (img.getAttribute('src') !== src) {
        img.src = src;
        img.alt = photos[idx];
      }
    }
  }

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  // Barra de pruebas (aparece con ?debug=1)
  function addDebugToolbar(frames, photos, initialIndex) {
    let currentIndex = initialIndex;

    const bar = document.createElement('div');
    bar.id = 'photo-debug-toolbar';
    Object.assign(bar.style, {
      position: 'fixed',
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: '15px',
      zIndex: '9999',
      background: 'rgba(0,0,0,0.7)',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '999px',
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      fontFamily: 'Montserrat, system-ui, sans-serif',
      fontSize: '14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    });

    const info = document.createElement('span');
    info.id = 'photo-debug-info';
    info.textContent = debugText(currentIndex, photos.length);

    const prevBtn = mkBtn('⟵ Prev');
    prevBtn.onclick = () => {
      currentIndex = mod(currentIndex - STEP, photos.length);
      setFrameImages(frames, photos, currentIndex);
      updateDebugInfo(currentIndex, photos.length);
    };

    const nextBtn = mkBtn('Next ⟶');
    nextBtn.onclick = () => {
      currentIndex = mod(currentIndex + STEP, photos.length);
      setFrameImages(frames, photos, currentIndex);
      updateDebugInfo(currentIndex, photos.length);
    };

    const todayBtn = mkBtn('Hoy');
    todayBtn.onclick = () => {
      currentIndex = computeBaseIndexByDate(new Date(), photos.length, STEP);
      setFrameImages(frames, photos, currentIndex);
      updateDebugInfo(currentIndex, photos.length);
    };

    const inputDate = document.createElement('input');
    inputDate.type = 'date';
    inputDate.style.border = 'none';
    inputDate.style.borderRadius = '6px';
    inputDate.style.padding = '5px 8px';
    inputDate.style.fontSize = '13px';
    inputDate.onchange = () => {
      const val = inputDate.value;
      if (val) {
        currentIndex = computeBaseIndexByDate(new Date(val), photos.length, STEP);
        setFrameImages(frames, photos, currentIndex);
        updateDebugInfo(currentIndex, photos.length);
      }
    };

    bar.append(prevBtn, nextBtn, todayBtn, inputDate, info);
    document.body.appendChild(bar);
  }

  function mkBtn(label) {
    const btn = document.createElement('button');
    btn.textContent = label;
    Object.assign(btn.style, {
      background: '#E91E63',
      color: '#fff',
      border: 'none',
      padding: '6px 10px',
      borderRadius: '999px',
      cursor: 'pointer',
      fontWeight: '600'
    });
    btn.onmouseenter = () => btn.style.opacity = '0.9';
    btn.onmouseleave = () => btn.style.opacity = '1';
    return btn;
  }

  function debugText(index, total) {
    return `setIndex=${index} | total=${total}`;
  }

  function updateDebugInfo(index, total) {
    const el = document.getElementById('photo-debug-info');
    if (el) el.textContent = debugText(index, total);
  }
})();