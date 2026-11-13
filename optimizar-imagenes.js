#!/usr/bin/env node
/* =========================================================
   optimizar-imagenes.js - prepara y optimiza las fotos del sitio.
   Lo corre solo GitHub (Actions) cada vez que se sube una foto o se guarda contenido.
   A mano (desde la raíz del repositorio):
       npm install                          (solo la primera vez: instala "sharp")
       node optimizar-imagenes.js
       node optimizar-imagenes.js --forzar  (rehace todas las versiones livianas)

   Qué hace, en este orden:
   1) FOTOS NUEVAS (las que todavía no tienen versión -sm): si traen datos de la cámara
      (ubicación GPS, modelo del celular...) o miden más de 2400 px, se enderezan, se achican
      a 2400 px como máximo y se les borran esos datos. El repositorio es público.
      Las fotos que ya estaban cargadas NO se tocan.
   2) VERSIONES LIVIANAS de cada foto de docs/img/obras, docs/img/novedades y docs/img/destacado (proyecto del inicio):
         foto-sm.webp          640 px de ancho   -> tarjetas y miniaturas
         foto-lg.webp          1600 px de ancho  -> foto ampliada y encabezados
         img/og/.../foto.jpg   1200 x 630        -> vista previa al compartir (solo portadas)
   3) LIMPIEZA: borra las versiones de fotos que ya no existen y las "-og.jpg" del formato anterior.
   ========================================================= */
const fs = require('fs');
const path = require('path');

let sharp;
try { sharp = require('sharp'); }
catch { console.error('Falta instalar sharp. Corré primero:  npm install'); process.exit(1); }
const { cargarObras, cargarNovedades } = require('./scripts/contenido');

const DOCS = path.join(__dirname, 'docs');
const CARPETAS = ['img/obras', 'img/novedades', 'img/destacado'];
const FORZAR = process.argv.includes('--forzar');
const MAX_LADO = 2400;                                       // lado más largo de una foto nueva

const ORIGINAL = /\.(jpe?g|png|webp)$/i;
const DERIVADA = /-(sm|lg)\.webp$/i;                         // versiones livianas (las crea este script)
const OG_VIEJO = /-og\.jpg$/i;                               // formato anterior de la vista previa: se elimina
const rel = f => path.relative(DOCS, f).split(path.sep).join('/');
const ogRuta = r => 'img/og/' + r.replace(/^img\//, '').replace(ORIGINAL, '.jpg');
const variante = (r, t) => t === 'og' ? ogRuta(r) : r.replace(ORIGINAL, `-${t}.webp`);
const aviso = m => console.log(`::warning::${m}`);            // aparece como aviso amarillo en GitHub Actions
const mb = n => (n / 1048576).toFixed(1) + ' MB';

const TAMANOS = {
  sm: img => img.resize({ width: 640, withoutEnlargement: true }).webp({ quality: 76 }),
  lg: img => img.resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }),
  og: img => img.resize(1200, 630, { fit: 'cover', position: 'attention', withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true })
};

/* ---------- Qué fotos son portada (necesitan la versión para compartir) ----------
   Misma regla que usa build.js para elegir la foto de la vista previa. */
const portadas = new Set();
let contenidoOk = false;
try {
  const obras = cargarObras(), novedades = cargarNovedades();
  obras.forEach(o => { const f = o.portada || (o.fotos && o.fotos[0]); if (f) portadas.add('img/obras/' + f); });
  novedades.forEach(n => { if (n.portada) portadas.add('img/novedades/' + n.portada); });
  contenidoOk = obras.length > 0;
} catch (e) { aviso('No pude leer content/: no se crearán ni limpiarán las imágenes para compartir. ' + e.message); }

const buscar = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? buscar(p) : [p];
}) : [];

const porLotes = async (lista, n, fn) => { for (let i = 0; i < lista.length; i += n) await Promise.all(lista.slice(i, i + n).map(fn)); };

(async () => {
  const todas = CARPETAS.flatMap(c => buscar(path.join(DOCS, c)));
  const originales = todas.filter(f => ORIGINAL.test(f) && !DERIVADA.test(f) && !OG_VIEJO.test(f));

  /* ---- 1) Fotos nuevas: achicar, enderezar y borrar datos de la cámara ---- */
  const nuevas = originales.filter(f => !fs.existsSync(path.join(DOCS, variante(rel(f), 'sm'))));
  let preparadas = 0;
  await porLotes(nuevas, 4, async f => {
    try {
      const m = await sharp(f).metadata();
      const motivos = [];
      if (m.exif) motivos.push('datos de la cámara');
      if (Math.max(m.width || 0, m.height || 0) > MAX_LADO) motivos.push(`${m.width}x${m.height}px`);
      if (!motivos.length) return;
      let img = sharp(f).rotate().resize({ width: MAX_LADO, height: MAX_LADO, fit: 'inside', withoutEnlargement: true });
      const ext = path.extname(f).toLowerCase();
      img = ext === '.png' ? img.png({ compressionLevel: 9 })
        : ext === '.webp' ? img.webp({ quality: 85 })
        : img.jpeg({ quality: 85, mozjpeg: true });
      const antes = fs.statSync(f).size, buf = await img.toBuffer();
      fs.writeFileSync(f, buf);
      preparadas++;
      console.log(`Preparada ${rel(f)} (${motivos.join(' + ')}): ${mb(antes)} -> ${mb(buf.length)}`);
    } catch (e) { aviso(`No se pudo preparar ${rel(f)}: ${e.message}`); }
  });

  /* ---- 2) Versiones livianas ---- */
  const trabajos = [], destinos = new Map();
  originales.forEach(origen => {
    const r = rel(origen);
    ['sm', 'lg'].concat(portadas.has(r) ? ['og'] : []).forEach(t => {
      const destino = path.join(DOCS, variante(r, t));
      if (destinos.has(destino) && destinos.get(destino) !== r) { aviso(`"${r}" y "${destinos.get(destino)}" generan el mismo archivo. Cambiá el nombre de una.`); return; }
      destinos.set(destino, r);
      if (FORZAR || !fs.existsSync(destino)) trabajos.push({ origen, destino, t });
    });
  });
  let hechas = 0;
  await porLotes(trabajos, 4, async ({ origen, destino, t }) => {
    try {
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      await TAMANOS[t](sharp(origen).rotate()).toFile(destino);   // rotate(): respeta la orientación; sharp no copia los datos EXIF
      hechas++;
    } catch (e) { aviso(`No se pudo procesar ${rel(origen)} (${t}): ${e.message}`); }
  });

  /* ---- 3) Limpieza ---- */
  let borradas = 0;
  const borrar = f => { try { fs.unlinkSync(f); borradas++; } catch (e) { aviso(`No pude borrar ${rel(f)}: ${e.message}`); } };
  if (originales.length) {
    const claves = new Set(originales.map(f => rel(f).replace(ORIGINAL, '').toLowerCase()));
    todas.filter(f => DERIVADA.test(f) && !claves.has(rel(f).replace(DERIVADA, '').toLowerCase())).forEach(borrar);   // foto eliminada
    todas.filter(f => OG_VIEJO.test(f)).forEach(borrar);                                                              // formato anterior
    if (contenidoOk) {
      const esperadas = new Set([...portadas].map(ogRuta));
      buscar(path.join(DOCS, 'img/og')).filter(f => !esperadas.has(rel(f))).forEach(borrar);
    }
    const vaciar = d => { if (!fs.existsSync(d)) return; fs.readdirSync(d, { withFileTypes: true }).forEach(e => e.isDirectory() && vaciar(path.join(d, e.name)));
      if (!fs.readdirSync(d).length) fs.rmdirSync(d); };
    vaciar(path.join(DOCS, 'img/og'));
  }

  console.log(`Imágenes: ${originales.length} fotos | ${preparadas} nuevas preparadas | ${hechas} versiones creadas | ${borradas} archivos viejos borrados.`);
})();
