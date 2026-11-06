#!/usr/bin/env node
/* =========================================================
   organizar-fotos.js - ordena docs/img/obras/ en UNA carpeta por obra.
   La carpeta se llama igual que el archivo de la obra (content/obras/<id>.json).

   Uso (desde la raíz del repositorio):
       node organizar-fotos.js            -> SOLO MUESTRA lo que haría (no cambia nada)
       node organizar-fotos.js --aplicar  -> mueve las fotos y corrige las rutas en content/obras/*.json

   Qué hace:
   1) Cada foto que usa una obra (galería, portada, miniatura, portada de video) se mueve a
      docs/img/obras/<id>/. Las carpetas viejas (casa_m, up15, samco...) quedan vacías y se borran solas.
      Se mueven también sus versiones -sm.webp y -lg.webp. La imagen para compartir (img/og/) la rehace
      optimizar-imagenes.js en la corrida siguiente.
   2) Fotos que ninguna obra usa:
        - si están en una carpeta vieja que pertenece a una sola obra, se van con ella a <id>/
        - si están sueltas en la raíz, van a docs/img/obras/_sin-asignar/ (para que decidas qué hacer)
   3) NO toca:
        - provisorio/ (la foto provisoria que comparten muchas obras)
        - fotos que una obra comparte con otra (se avisa; hay que resolverlo a mano)
        - fotos que están escritas a mano en una página (ej. el fondo de obras.html)
   ========================================================= */
const fs = require('fs');
const path = require('path');

const APLICAR = process.argv.includes('--aplicar');
const DOCS = path.join(__dirname, 'docs');
const BASE = path.join(DOCS, 'img/obras');
const CONTENT = path.join(__dirname, 'content/obras');
const SIN_ASIGNAR = '_sin-asignar';

const ORIGINAL = /\.(jpe?g|png|webp)$/i;
const DERIVADA = /-(sm|lg)\.webp$/i;
const aviso = m => console.log(`::warning::${m}`);
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const sinPrefijo = v => v.replace(/^\/+/, '').replace(/^img\/obras\//, '');
const posix = p => p.split(path.sep).join('/');

const caminar = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? caminar(p) : [p];
}) : [];

/* ---------- 1) Qué fotos usa cada obra ---------- */
const obras = fs.readdirSync(CONTENT).filter(f => f.endsWith('.json')).map(f => {
  const archivo = path.join(CONTENT, f);
  const texto = fs.readFileSync(archivo, 'utf8');
  const j = JSON.parse(texto);
  const valores = [...(j.fotos || []), j.portada, j.miniatura, ...(j.videos || []).map(v => v && v.poster)]
    .filter(v => typeof v === 'string' && v);
  return { id: f.replace(/\.json$/, ''), archivo, texto, rutas: [...new Set(valores.map(sinPrefijo))] };
});

const duenos = new Map();                       // ruta -> Set(ids de obras)
obras.forEach(o => o.rutas.forEach(r => { if (!duenos.has(r)) duenos.set(r, new Set()); duenos.get(r).add(o.id); }));

/* ---------- Fotos escritas a mano en páginas o estilos: no se mueven ---------- */
const fijas = new Set();
[...fs.readdirSync(DOCS).filter(f => /\.html$/.test(f) && !/^(obra|novedad)-/.test(f)).map(f => path.join(DOCS, f)),
 ...caminar(path.join(DOCS, 'css')).filter(f => f.endsWith('.css'))]
  .forEach(f => { for (const m of fs.readFileSync(f, 'utf8').matchAll(/img\/obras\/([^'")\s?#]+)/g)) fijas.add(decodeURI(m[1])); });

/* ---------- 2) Plan de movimientos ---------- */
const originales = caminar(BASE).map(f => posix(path.relative(BASE, f)))
  .filter(r => ORIGINAL.test(r) && !DERIVADA.test(r));
const existentes = new Set(originales.map(r => r.toLowerCase()));
const planificados = new Set();
const movimientos = [];                          // { de, a, obra|null, motivo }

const destinoLibre = (carpeta, nombre) => {
  const ext = path.extname(nombre), raiz = path.basename(nombre, ext);
  let n = 1, candidato = `${carpeta}/${nombre}`;
  while (existentes.has(candidato.toLowerCase()) || planificados.has(candidato.toLowerCase())) candidato = `${carpeta}/${raiz}-${++n}${ext}`;
  planificados.add(candidato.toLowerCase());
  return candidato;
};

// carpeta vieja -> ids de las obras que usan fotos de ella (para saber a quién pertenece)
const carpetaDuena = new Map();
duenos.forEach((ids, ruta) => {
  const c = path.posix.dirname(ruta); if (c === '.' || c === 'provisorio') return;
  if (!carpetaDuena.has(c)) carpetaDuena.set(c, new Set());
  ids.forEach(i => carpetaDuena.get(c).add(i));
});

duenos.forEach((ids, ruta) => {
  if (ruta.startsWith('provisorio/')) return;
  if (!existentes.has(ruta.toLowerCase())) { aviso(`La obra "${[...ids].join(', ')}" usa una foto que no existe: img/obras/${ruta}`); return; }
  if (ids.size > 1) { aviso(`La foto img/obras/${ruta} la usan varias obras (${[...ids].join(', ')}): no se mueve.`); return; }
  if (fijas.has(ruta)) { aviso(`La foto img/obras/${ruta} está escrita a mano en una página del sitio: no se mueve.`); return; }
  const id = [...ids][0];
  if (path.posix.dirname(ruta) === id) return;                      // ya está en su carpeta
  movimientos.push({ de: ruta, a: destinoLibre(id, path.posix.basename(ruta)), obra: id, motivo: 'la usa la obra' });
});

originales.filter(r => !duenos.has(r) && !r.startsWith('provisorio/') && !fijas.has(r)).forEach(r => {
  const carpeta = path.posix.dirname(r);
  if (carpeta === '.') { movimientos.push({ de: r, a: destinoLibre(SIN_ASIGNAR, r), obra: null, motivo: 'ninguna obra la usa' }); return; }
  if (carpeta === SIN_ASIGNAR) return;
  const d = carpetaDuena.get(carpeta);
  if (d && d.size === 1) {
    const id = [...d][0];
    if (carpeta !== id) movimientos.push({ de: r, a: destinoLibre(id, path.posix.basename(r)), obra: null, motivo: `ninguna obra la usa; acompaña a su carpeta "${carpeta}"` });
  } else aviso(`La foto img/obras/${r} no la usa ninguna obra y su carpeta no tiene un único dueño: queda donde está.`);
});

/* ---------- 3) Informe ---------- */
console.log(`\n${APLICAR ? 'APLICANDO' : 'PRUEBA (no se cambia nada)'}: ${movimientos.length} fotos para mover\n`);
const porObra = new Map();
movimientos.forEach(m => { const k = m.a.split('/')[0]; if (!porObra.has(k)) porObra.set(k, []); porObra.get(k).push(m); });
[...porObra.keys()].sort().forEach(k => {
  console.log(`  ${k}/  (${porObra.get(k).length})`);
  porObra.get(k).forEach(m => console.log(`      ${m.de}  ->  ${m.a}${m.obra ? '' : '   [' + m.motivo + ']'}`));
});

if (!APLICAR) { console.log('\nPara hacerlo de verdad: node organizar-fotos.js --aplicar'); process.exit(0); }

/* ---------- 4) Aplicar ---------- */
const mover = (de, a) => {
  fs.mkdirSync(path.dirname(path.join(BASE, a)), { recursive: true });
  fs.renameSync(path.join(BASE, de), path.join(BASE, a));
};
const variante = (r, t) => r.replace(ORIGINAL, `-${t}.webp`);
movimientos.forEach(m => {
  mover(m.de, m.a);
  ['sm', 'lg'].forEach(t => { const d = variante(m.de, t); if (fs.existsSync(path.join(BASE, d))) mover(d, variante(m.a, t)); });
});

// Rutas en los JSON (se conserva el formato: con o sin "/img/obras/" adelante)
let jsonCambiados = 0;
obras.forEach(o => {
  let texto = o.texto;
  movimientos.filter(m => m.obra === o.id).forEach(m => {
    texto = texto.replace(new RegExp('"((?:/?img/obras/)?)' + escRe(m.de) + '"', 'g'), (_, pre) => `"${pre}${m.a}"`);
  });
  if (texto !== o.texto) { JSON.parse(texto); fs.writeFileSync(o.archivo, texto); jsonCambiados++; }   // JSON.parse: si quedó mal, corta antes de guardar
});

// Carpetas vacías
const vaciar = d => {
  if (!fs.existsSync(d)) return;
  fs.readdirSync(d, { withFileTypes: true }).forEach(e => e.isDirectory() && vaciar(path.join(d, e.name)));
  if (d !== BASE && !fs.readdirSync(d).length) fs.rmdirSync(d);
};
vaciar(BASE);

console.log(`\nListo: ${movimientos.length} fotos movidas, ${jsonCambiados} obras actualizadas.`);
