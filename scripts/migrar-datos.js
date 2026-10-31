#!/usr/bin/env node
/* migrar-datos.js - USO ÚNICO. Convierte docs/js/obras-data.js (incluidas las obras comentadas)
   y novedades-data.js a archivos JSON en content/, y comprueba que no se perdió nada.
   No modifica ni borra los archivos originales. */
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const { cargarObras, cargarNovedades } = require('./contenido');
const RAIZ = path.join(__dirname, '..'), DOCS = path.join(RAIZ, 'docs');
const idValido = id => /^[A-Za-z0-9_-]+$/.test(id);

// ---------- 1. Leer datos viejos (activas + comentadas) ----------
const src = fs.readFileSync(path.join(DOCS, 'js/obras-data.js'), 'utf8');
const ACTIVAS = vm.runInNewContext(src + '\n;OBRAS');
const lineas = src.split('\n');
const ini = lineas.findIndex((l, i) => i > 60 && l.trim() === '/*');
const fin = lineas.length - 1 - [...lineas].reverse().findIndex(l => l.includes('*/'));
const cuerpo = lineas.slice(ini + 1, fin + 1).join('\n').replace(/\*\/\s*$/, '');
const COMENTADAS = vm.runInNewContext("const FOTO_PROVISORIA='prov-front.png';[" + cuerpo + "\n]");
const NOVEDADES = vm.runInNewContext(fs.readFileSync(path.join(DOCS, 'js/novedades-data.js'), 'utf8') + '\n;NOVEDADES');
console.log(`Leídas: ${ACTIVAS.length} activas, ${COMENTADAS.length} comentadas, ${NOVEDADES.length} novedades`);

// ---------- 2. Conversión ----------
const videosAJson = v => [].concat(v === undefined ? [] : v).map(x => {
  const it = typeof x === 'string' ? { src: x } : x;
  if (!/\.(mp4|webm)$/i.test(it.src) && !/^https?:/.test(it.src)) return { youtube: it.src };
  const r = { archivo: it.src };
  if (it.poster) r.poster = it.poster; if (it.vertical) r.vertical = true; if (it.titulo) r.titulo = it.titulo;
  return r;
});
const limpiar = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && !v.length)));

// Rutas siempre completas, relativas a docs/img/obras/ (antes: nombre + carpeta aparte)
const conCarpeta = (o, f) => f && (o.carpeta ? o.carpeta + '/' : '') + f;
function obraAJson(o, orden, publicada) {
  const datos = o.datos || [], extra = [];
  let superficie, plazo;
  datos.forEach(d => {
    const m = /^(Superficie|Plazo): (.*)$/s.exec(d);
    if (m && m[1] === 'Superficie' && superficie === undefined) superficie = m[2];
    else if (m && m[1] === 'Plazo' && plazo === undefined) plazo = m[2];
    else extra.push(d);
  });
  return limpiar({
    publicada, orden, destacada: o.destacada === true ? 99 : o.destacada,
    nombre: o.nombre, categoria: o.categoria, tipo: o.tipo, con: o.con, estado: o.estado,
    comitente: o.comitente, ubicacion: o.ubicacion, mapa: o.mapa,
    superficie, plazo, datos_extra: extra, resumen: o.resumen, descripcion: o.descripcion,
    miniatura: conCarpeta(o, o.miniatura), portada: o.portada, fotos: (o.fotos || []).map(f => conCarpeta(o, f)), videos: videosAJson(o.video)
  });
}

const salida = path.join(RAIZ, 'content');
fs.rmSync(salida, { recursive: true, force: true });
['obras', 'novedades', 'empresa'].forEach(d => fs.mkdirSync(path.join(salida, d), { recursive: true }));
const escribir = (ruta, obj) => fs.writeFileSync(ruta, JSON.stringify(obj, null, 2) + '\n');

const todas = [...ACTIVAS.map(o => [o, true]), ...COMENTADAS.map(o => [o, false])];
const vistos = new Set();
todas.forEach(([o, pub], i) => {
  assert(idValido(o.id), 'id inválido: ' + o.id);
  assert(!vistos.has(o.id), 'id repetido: ' + o.id); vistos.add(o.id);
  escribir(path.join(salida, 'obras', o.id + '.json'), obraAJson(o, (i + 1) * 10, pub));
});
NOVEDADES.forEach(n => {
  assert(idValido(n.id), 'id inválido: ' + n.id);
  escribir(path.join(salida, 'novedades', n.id + '.json'), limpiar({
    publicada: true, titulo: n.titulo, categoria: n.categoria, fecha: n.fecha, portada: n.portada,
    resumen: n.resumen, texto: n.texto, fotos: n.fotos, videos: videosAJson(n.video) }));
});
// Cifras de nosotros.html
const nos = fs.readFileSync(path.join(DOCS, 'nosotros.html'), 'utf8');
const cifras = [...nos.matchAll(/<b>\+<span class="num" data-valor="(\d+)">[^<]*<\/span><\/b><span>([^<]+)<\/span>/g)]
  .map(m => ({ valor: Number(m[1]), etiqueta: m[2].trim() }));
assert(cifras.length === 4, 'no encontré las 4 cifras');
escribir(path.join(salida, 'empresa/cifras.json'), { cifras });

// ---------- 3. Prueba de equivalencia ----------
// Dos datos "iguales" para el sitio: se ignoran vacíos y la diferencia string/objeto en video
const canon = v0 => {
  const v = JSON.parse(JSON.stringify(v0));
  return canonRec(v);
};
const canonRec = v => {
  if (Array.isArray(v)) return v.map(canonRec);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort()
    .map(k => [k, canonRec(v[k])]).filter(([, x]) => x !== '' && x !== undefined && !(Array.isArray(x) && !x.length)));
  return v;
};
const resolver = o => ({ ...o, carpeta: undefined, miniatura: conCarpeta(o, o.miniatura), fotos: (o.fotos || []).map(f => conCarpeta(o, f)) });
const vid = o => { if (o.video === undefined) return o; const v = [].concat(o.video).map(x => typeof x === 'string' ? { src: x } : x); return { ...o, video: v }; };
const nuevas = Object.fromEntries(cargarObras({ incluirBorradores: true }).map(o => [o.id, o]));
let n = 0;
todas.forEach(([o]) => { assert.deepStrictEqual(canon(vid(nuevas[o.id])), canon(vid(resolver(o))), 'DIFERENCIA en obra ' + o.id); n++; });
const nov = Object.fromEntries(cargarNovedades().map(x => [x.id, x]));
NOVEDADES.forEach(x => assert.deepStrictEqual(canon(vid(nov[x.id])), canon(vid(x)), 'DIFERENCIA en novedad ' + x.id));
// Orden y publicadas
assert.deepStrictEqual(cargarObras().map(o => o.id), JSON.parse(JSON.stringify(ACTIVAS.map(o => o.id))), 'cambió el orden de las obras activas');
const dest = l => l.filter(o => o.destacada).sort((a, b) => a.destacada - b.destacada).map(o => o.id);
assert.deepStrictEqual(dest(cargarObras()), JSON.parse(JSON.stringify(dest(ACTIVAS))), 'cambió el orden de destacadas');
// Archivos referenciados que no existen (solo obras publicadas y novedades)
const falta = [], ex = r => fs.existsSync(path.join(DOCS, r));
cargarObras().forEach(o => {
  [...o.fotos, o.miniatura, o.portada].filter(Boolean).forEach(f => ex('img/obras/' + f) || falta.push(o.id + ': img/obras/' + f));
  [].concat(o.video || []).forEach(v => { const it = typeof v === 'string' ? { src: v } : v;
    if (/\.(mp4|webm)$/i.test(it.src) && !ex('video/' + it.src)) falta.push(o.id + ': video/' + it.src);
    if (it.poster && !ex('img/obras/' + it.poster)) falta.push(o.id + ': poster ' + it.poster); });
});
cargarNovedades().forEach(x => {
  [...x.fotos, x.portada].filter(Boolean).forEach(f => ex('img/novedades/' + f) || falta.push(x.id + ': img/novedades/' + f));
  [].concat(x.video || []).forEach(v => { const it = typeof v === 'string' ? { src: v } : v;
    if (/\.(mp4|webm)$/i.test(it.src) && !ex('video/' + it.src)) falta.push(x.id + ': video/' + it.src);
    if (it.poster && !ex('img/novedades/' + it.poster)) falta.push(x.id + ': poster ' + it.poster); });
});
console.log(falta.length ? 'ARCHIVOS FALTANTES:\n  ' + falta.join('\n  ') : 'Todos los archivos referenciados existen.');
console.log(`OK: ${n} obras (${ACTIVAS.length} publicadas + ${COMENTADAS.length} borradores), ${NOVEDADES.length} novedades y ${cifras.length} cifras. Equivalencia exacta.`);
