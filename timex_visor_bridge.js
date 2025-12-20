// TIMEX -> VISOR bridge
// Requiere que el elemento clicado (o alguno de sus padres) tenga data-lat y data-lng
// y que el estado sea uno de: ACTIVACION, INTERVENCION, FINALIZACION, DISPONIBLES.

(() => {
  const VISOR_URL = './visor.html'; // ajusta si lo pones en otra ruta
  let visorWin = null;

  function openVisor() {
    if (!visorWin || visorWin.closed) {
      visorWin = window.open(VISOR_URL, 'VISOR', 'noopener,noreferrer,width=1100,height=750');
    }
    return visorWin;
  }

  function findCoords(el) {
    let cur = el;
    while (cur && cur !== document.documentElement) {
      const lat = cur.getAttribute && cur.getAttribute('data-lat');
      const lng = cur.getAttribute && cur.getAttribute('data-lng');
      if (lat != null && lng != null) return { lat: Number(lat), lng: Number(lng) };
      cur = cur.parentElement;
    }
    return null;
  }

  function normalizeEstado(text) {
    const t = String(text || '').toUpperCase().trim();
    if (t.includes('ACTIVACION')) return 'ACTIVACION';
    if (t.includes('INTERVENCION')) return 'INTERVENCION';
    if (t.includes('FINALIZACION')) return 'FINALIZACION';
    if (t.includes('DISPONIBLES')) return 'DISPONIBLES';
    return null;
  }

  function sendToVisor(payload) {
    const w = openVisor();
    if (!w) return;
    w.postMessage({ type: 'VISOR_MARKER', payload }, '*');
  }

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;

    const estado = normalizeEstado(target.textContent);
    if (!estado) return;

    const coords = findCoords(target);
    if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) return;

    const label = target.getAttribute('data-label')
      || (target.closest && target.closest('[data-label]') && target.closest('[data-label]').getAttribute('data-label'))
      || 'Punto';

    sendToVisor({ estado, lat: coords.lat, lng: coords.lng, label });
  });
})();
