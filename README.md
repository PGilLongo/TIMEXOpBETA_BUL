# TIMEX (PWA)

Este repositorio está listo para subirse a GitHub y publicarse como **PWA instalable** (Android/Chrome, iOS/Safari, desktop).

## Estructura
- `index.html` (pantalla principal: TIMEX + Navegador en dos iframes)
- `PDF TIMEX.html`
- `NAVEGADOR.html`
- `manifest.json`
- `service-worker.js`
- `icons/`

## Publicar en GitHub Pages
1. Sube estos archivos al repositorio (en la raíz).
2. En GitHub: **Settings → Pages**
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
3. Abre la URL de Pages que te da GitHub (será algo como `https://TU_USUARIO.github.io/TU_REPO/`).

## Instalar como app
- **Android (Chrome/Edge):** menú ⋮ → *Instalar aplicación* / *Añadir a pantalla de inicio*.
- **iPhone/iPad (Safari):** botón *Compartir* → *Añadir a pantalla de inicio*.

## Notas
- El Service Worker es **scope-safe**: funciona aunque el repo se publique en un subdirectorio (p. ej. GitHub Pages).
- Si no aparece “Instalar”: borra datos del sitio y recarga (o abre en una ventana privada).
