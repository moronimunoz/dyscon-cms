# Cómo funciona el sitio de DyScon (desde la integración con Pages CMS)

**Contenido** (se edita desde el panel, https://app.pagescms.org):
- `content/obras/*.json` · `content/novedades/*.json` · `content/empresa/cifras.json`
- Las fotos y videos que se suben van a `docs/img/` y `docs/video/`.

**Publicación automática:** al guardar en el panel, GitHub corre `build.js` (pestaña *Actions* > "Generar páginas"),
que regenera las páginas de cada obra/novedad, `docs/js/obras-data.js`, `docs/js/novedades-data.js`, las cifras de
`docs/nosotros.html`, el sitemap y el robots. En 1 a 3 minutos GitHub Pages lo publica.

**No editar a mano:** `docs/js/obras-data.js`, `docs/js/novedades-data.js` y las páginas `obra-*.html` / `novedad-*.html`
(se pisan en cada corrida). Los datos originales de antes de la migración están en `legacy/`.

**Borradores:** una obra o novedad con "Publicada en el sitio" desmarcado queda guardada pero no se ve en la página.

**Avisos:** si algo está mal (obra publicada sin fotos, foto que no existe, nombre de archivo inválido), la corrida de
Actions muestra un aviso amarillo con el detalle.

**Fotos:** las versiones livianas (`-sm`, `-lg`, `-og`) todavía se generan a mano con `node optimizar-imagenes.js`
(se automatiza en una etapa siguiente). Mientras tanto el sitio usa la foto original.
