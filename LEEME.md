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

## Funciones agregadas (mapa, analítica, cifras, 404, tipografía)

**Mapa de obras.** En `obras.html` el botón *Mapa* muestra las obras sobre OpenStreetMap (Leaflet, guardado en `docs/vendor/leaflet/`; no necesita clave). Se ubica cada obra así: coordenadas escritas en *Dirección para el mapa* → código de Google (`X98V+JHG ...`) → dirección (se busca en OpenStreetMap una sola vez y queda en `scripts/geocache.json`) → centro de la ciudad de *Ubicación* (se marca como "aproximada"). Para afinar una obra, completá bien *Dirección para el mapa* en el panel. Lo hacen `scripts/ubicaciones.js` y `scripts/geocodificar.js`; si OpenStreetMap no responde, se publica igual.

**Obras relacionadas y anterior/siguiente.** Las calcula `build.js` (misma categoría, ciudad y tipo) y las dibuja `docs/js/obra.js`.

**Analítica.** Está apagada hasta que se complete `CONFIG.proveedor` en `docs/js/analitica.js` (Plausible, Umami o GA4). No mide en pruebas locales ni con "No rastrear". Registra llamadas, mails, WhatsApp, PDF, redes, formulario enviado, mapa y páginas 404.

**Cifras y línea de tiempo del inicio.** Salen del panel: *Cifras de la empresa* (casilla "Mostrar en el inicio") y *Línea de tiempo (inicio)*. `build.js` reescribe lo que está entre las marcas `<!-- ...:inicio -->` y `<!-- ...:fin -->` de `docs/index.html`: no las borres.

**Página 404.** `docs/404.html` calcula sola la raíz del sitio, así que sirve en github.io y en dysconsa.com.ar.

**Tipografía.** Poppins se sirve desde `docs/fonts/` (ya no se pide a Google Fonts).

**Texto alternativo de fotos.** En cada obra se puede escribir *Descripción de la foto principal*; si está vacío se arma con el nombre y la ciudad.

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

## Seguridad, recuperación y respaldos
- El repositorio es **público**: todo lo que está en él (incluidos borradores y `content/`) se puede leer. No guardar acá nada privado.
- Todo cambio queda en el historial de GitHub (pestaña *Commits*): nada se pierde. Para recuperar un archivo o una foto borrada,
  abrir `https://raw.githubusercontent.com/moronimunoz/dyscon-cms/<código-del-commit>/<ruta-del-archivo>` con el código de un commit anterior.
- Copia fuera de GitHub: *Code > Download ZIP* en la página principal del repositorio, guardada cada tanto en el Drive de la empresa.
- Detalle completo en el "Manual del administrador" (documento aparte).
