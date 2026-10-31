#!/usr/bin/env node
/* =========================================================
   optimizar-imagenes.js - crea versiones livianas de las fotos del sitio
   Uso (desde la raíz del repositorio, al lado de la carpeta docs):
       npm install            (solo la primera vez: instala "sharp")
       node optimizar-imagenes.js
       node optimizar-imagenes.js --forzar     (rehace todas, aunque ya existan)

   Por cada foto de docs/img/obras y docs/img/novedades crea, al lado de la original:
       foto-sm.webp   640 px de ancho    -> tarjetas y miniaturas de la galería
       foto-lg.webp   1600 px de ancho   -> foto ampliada, encabezados y galerías grandes
       foto-og.jpg    1200 x 630         -> vista previa al compartir (solo portadas)
   Las originales NO se tocan ni se borran. Solo se procesan las fotos nuevas o modificadas.
   ========================================================= */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let sharp;
try { sharp = require('sharp'); }
catch { console.error('Falta instalar sharp. Corré primero:  npm install'); process.exit(1); }

const DOCS = path.join(__dirname, 'docs');
const CARPETAS = ['img/obras', 'img/novedades'];
const FORZAR = process.argv.includes('--forzar');

const ORIGINAL = /\.(jpe?g|png|webp)$/i;
const DERIVADA = /-(sm|lg|og)\.(webp|jpg)$/i;          // lo que genera este script: no se vuelve a procesar
const variante = (ruta, t) => ruta.replace(ORIGINAL, t === 'og' ? '-og.jpg' : `-${t}.webp`);

/* Cambiar en "lg: img" el width a 2200 y el quality a 84 a cada foto ampliada
   pesaría entre un 50 y un 80 % más, pero se vería mejor en pantallas grandes.
   Después correr "node optimizar-imagenes.js --forzar" para rehacer todas las versiones.*/
const TAMANOS = {
  sm: img => img.resize({ width: 640, withoutEnlargement: true }).webp({ quality: 76 }),
  lg: img => img.resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }),
  og: img => img.resize(1200, 630, { fit: 'cover', position: 'attention', withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true })
};

/* ---------- Qué fotos son portada (necesitan la versión "og") ----------
   Es la misma regla que usa build.js para elegir la foto de la vista previa. */
const datos = (archivo, variable) => vm.runInNewContext(fs.readFileSync(path.join(DOCS, archivo), 'utf8') + `\n;${variable}`);
const portadas = new Set();
try {
  datos('js/obras-data.js', 'OBRAS').forEach(o => {
    const base = 'img/obras/' + (o.carpeta ? o.carpeta + '/' : '');
    const foto = o.portada ? 'img/obras/' + o.portada : (o.fotos && o.fotos[0]) ? base + o.fotos[0] : null;
    if (foto) portadas.add(foto);
  });
  datos('js/novedades-data.js', 'NOVEDADES').forEach(n => { if (n.portada) portadas.add('img/novedades/' + n.portada); });
} catch (e) { console.warn('Aviso: no pude leer los datos, no se crearán las imágenes "og". ' + e.message); }

/* ---------- Recorre las carpetas ---------- */
const buscar = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? buscar(p) : [p];
}) : [];

const fotos = CARPETAS.flatMap(c => buscar(path.join(DOCS, c)))
  .filter(f => ORIGINAL.test(f) && !DERIVADA.test(f));

const trabajos = [];
const destinos = new Map();                              // detecta dos originales que darían el mismo archivo (01.jpg y 01.webp)
fotos.forEach(origen => {
  const rel = path.relative(DOCS, origen).split(path.sep).join('/');
  const tipos = ['sm', 'lg'].concat(portadas.has(rel) ? ['og'] : []);
  tipos.forEach(t => {
    const destino = path.join(DOCS, variante(rel, t));
    if (destinos.has(destino)) { console.warn(`Aviso: "${rel}" y "${destinos.get(destino)}" generan el mismo archivo. Cambiá el nombre de una.`); return; }
    destinos.set(destino, rel);
    const al_dia = fs.existsSync(destino) && fs.statSync(destino).mtimeMs >= fs.statSync(origen).mtimeMs;
    if (FORZAR || !al_dia) trabajos.push({ origen, destino, t });
  });
});

const mb = n => (n / 1048576).toFixed(1) + ' MB';

(async () => {
  console.log(`${fotos.length} fotos originales, ${trabajos.length} versiones para crear.`);
  let hechas = 0, errores = 0, pesoOrigen = 0, pesoNuevo = 0;

  for (let i = 0; i < trabajos.length; i += 4) {          // de a 4 a la vez
    await Promise.all(trabajos.slice(i, i + 4).map(async ({ origen, destino, t }) => {
      try {
        await TAMANOS[t](sharp(origen).rotate()).toFile(destino);   // rotate(): respeta la orientación del celular; sharp borra los datos EXIF (ubicación, etc.)
        pesoOrigen += fs.statSync(origen).size;
        pesoNuevo += fs.statSync(destino).size;
        hechas++;
      } catch (e) {
        errores++;
        console.warn(`No se pudo procesar ${path.relative(DOCS, origen)} (${t}): ${e.message}`);
      }
    }));
    process.stdout.write(`\r${Math.min(i + 4, trabajos.length)} / ${trabajos.length}`);
  }
  if (trabajos.length) console.log();
  console.log(`Listo: ${hechas} imágenes creadas${errores ? `, ${errores} con error` : ''}.`);
  if (hechas) console.log(`Peso: ${mb(pesoOrigen)} de originales leídos -> ${mb(pesoNuevo)} de versiones nuevas.`);
})();
