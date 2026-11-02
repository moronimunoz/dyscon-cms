# Cómo funciona el sitio de DyScon (desde la integración con Pages CMS)

**Contenido** (se edita desde el panel, https://app.pagescms.org):
- `content/obras/*.json` · `content/novedades/*.json` · `content/empresa/cifras.json`
- Las fotos y videos que se suben van a `docs/img/obras/`, `docs/img/novedades/` y `docs/video/`.

**Publicación automática:** al guardar en el panel (o subir una foto), GitHub corre el flujo "Generar páginas"
(pestaña *Actions*): optimiza las fotos, corre `build.js` y regenera las páginas de cada obra/novedad,
`docs/js/obras-data.js`, `docs/js/novedades-data.js`, las cifras de `docs/nosotros.html`, el sitemap y el robots.
Después GitHub Pages lo publica. En total tarda de 2 a 4 minutos (en el navegador, Ctrl+F5 para ver lo último).

**No editar a mano:** `docs/js/obras-data.js`, `docs/js/novedades-data.js`, las páginas `obra-*.html` / `novedad-*.html`
y las carpetas `docs/img/og/` (se pisan en cada corrida). Los datos de antes de la migración están en `legacy/`.

**Borradores:** una obra o novedad con "Publicada en el sitio" desmarcado queda guardada pero no se ve en la página.

## Fotos
- Subí fotos **.jpg, .jpeg o .png** desde el panel. El selector del panel solo muestra esas.
- Cada foto nueva se **achica solita** a 2400 px como máximo, se endereza si el celular la guardó girada y se le
  **borra la ubicación GPS y los datos de la cámara** (el repositorio es público). Las fotos viejas no se tocan.
- Por cada foto se crean automáticamente las versiones livianas `-sm.webp` (640 px) y `-lg.webp` (1600 px), y para las
  portadas la imagen de vista previa al compartir (`docs/img/og/...`, 1200 x 630). Hasta que terminan (1 a 3 minutos),
  el sitio muestra la foto original.
- Si se elimina una foto, sus versiones livianas se borran solas.
- Si una foto está dañada, la corrida de Actions muestra un aviso amarillo con el nombre del archivo.
- Rehacer todas las versiones livianas a mano: `npm install` y `node optimizar-imagenes.js --forzar`.
