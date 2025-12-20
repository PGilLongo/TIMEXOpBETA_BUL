// TIMEX / NAVEGADOR -> VISOR bridge
(() => {
  const VISOR_URL = './visor.html';
  let visorWin = null;

  function openVisor() {
    if (!visorWin || visorWin.closed) {
      visorWin = window.open(VISOR_URL, 'VISOR', 'width=1100,height=750');
    }
    return visorWin;
  }

  function sendToVisor(payload) {
    const w = openVisor();
    if (!w) return;
    w.postMessage({ type: 'VISOR_MARKER', payload }, '*');
  }

  window.TIMEX_VISOR = { openVisor, sendToVisor };

  window.addEventListener('VISOR_SEND', (e) => {
    const d = e && e.detail;
    if (!d) return;
    sendToVisor(d);
  });

  document.addEventListener('click', (e) => {
    const t = e.target && e.target.closest ? e.target.closest('[data-estado][data-lat][data-lng]') : null;
    if (!t) return;

    const estado = String(t.getAttribute('data-estado') || '').toUpperCase().trim();
    const lat = Number(t.getAttribute('data-lat'));
    const lng = Number(t.getAttribute('data-lng'));
    const label = t.getAttribute('data-label') || t.textContent || 'Punto';

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    sendToVisor({ estado, lat, lng, label });
  });
})();
