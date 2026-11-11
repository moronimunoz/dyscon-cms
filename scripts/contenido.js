/* contenido.js - lee content/*.json y los devuelve en el MISMO formato que hoy tienen
   OBRAS y NOVEDADES en obras-data.js / novedades-data.js. Lo usan build.js y migrar-datos.js. */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const leerJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const archivos = dir => fs.existsSync(dir)
  ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort() : [];

// El editor visual del panel guarda cada párrafo como <p>...</p>, pero el sitio ya envuelve cada
// ítem en <p>: se sacan los <p> sobrantes (y los párrafos vacíos) para que se vea igual que siempre.
function parrafos(lista) {
  const salida = [];
  (lista || []).forEach(t => {
    if (typeof t !== 'string') return;
    const s = t.trim();
    if (/^<p[\s>]/i.test(s) && !/<(ul|ol)[\s>]/i.test(s)) {
      s.split(/<\/p>\s*/i).forEach(parte => {
        const x = parte.replace(/^\s*<p[^>]*>/i, '').trim();
        if (x && !/^(<br\s*\/?>\s*)+$/i.test(x)) salida.push(x);   // descarta párrafos vacíos
      });
    } else if (s) salida.push(s);
  });
  return salida;
}

// Pages CMS escribe las rutas con el prefijo público de cada carpeta ("/img/obras/casa_m/01.jpg").
// El sitio las necesita sin ese prefijo ("casa_m/01.jpg"). Se acepta cualquiera de las dos formas.
const sinPrefijo = (v, prefijo) => typeof v !== 'string' ? v
  : v.replace(/^\/+/, '').replace(new RegExp('^' + prefijo + '/'), '');
const rutas = (lista, prefijo) => (lista || []).map(f => sinPrefijo(f, prefijo)).filter(Boolean);

// [{youtube}|{archivo, poster, vertical, titulo}]  ->  formato que entiende video.js
// carpetaPoster: 'img/obras' o 'img/novedades' (las portadas de video viven con las fotos)
function videosALegacy(lista, carpetaPoster) {
  const salida = (lista || []).filter(v => v && (v.youtube || v.archivo)).map(v => {
    if (v.youtube) return v.youtube;
    const o = { src: sinPrefijo(v.archivo, 'video') };
    if (v.poster) o.poster = sinPrefijo(v.poster, carpetaPoster);
    if (v.vertical) o.vertical = true;
    if (v.titulo) o.titulo = v.titulo;
    return Object.keys(o).length === 1 ? o.src : o;
  });
  return salida.length === 0 ? undefined : salida.length === 1 ? salida[0] : salida;
}

function obraALegacy(j, id) {
  const o = { id, nombre: j.nombre, categoria: j.categoria, tipo: j.tipo || 'propia', estado: j.estado };
  const poner = (k, v) => { if (v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length)) o[k] = v; };
  poner('con', j.con); o.comitente = j.comitente || ''; poner('ubicacion', j.ubicacion); poner('mapa', j.mapa); poner('direccion', j.direccion);
  // Ubicaciones extra (solo para el mapa de obras.html): [{ nombre?, mapa }]. La principal sigue siendo "mapa".
  poner('ubicaciones_extra', (j.ubicaciones_extra || [])
    .filter(e => e && String(e.mapa || '').trim())
    .map(e => { const r = { mapa: String(e.mapa).trim() }; if (e.nombre && String(e.nombre).trim()) r.nombre = String(e.nombre).trim(); return r; }));
  poner('destacada', j.destacada); poner('resumen', j.resumen); poner('alt', j.alt);
  o.descripcion = parrafos(j.descripcion);
  const datos = [];
  if (j.superficie) datos.push('Superficie: ' + j.superficie);
  if (j.plazo) datos.push('Plazo: ' + j.plazo);
  (j.datos_extra || []).forEach(d => datos.push(d));
  poner('datos', datos);
  poner('miniatura', sinPrefijo(j.miniatura, 'img/obras')); poner('portada', sinPrefijo(j.portada, 'img/obras'));   // rutas completas dentro de img/obras/
  o.fotos = rutas(j.fotos, 'img/obras');
  poner('video', videosALegacy(j.videos, 'img/obras'));
  return o;
}

function novedadALegacy(j, id) {
  const n = { id, titulo: j.titulo, categoria: j.categoria, fecha: j.fecha, portada: sinPrefijo(j.portada, 'img/novedades'),
    resumen: j.resumen || '', texto: parrafos(j.texto), fotos: rutas(j.fotos, 'img/novedades') };
  const v = videosALegacy(j.videos, 'img/novedades'); if (v !== undefined) n.video = v;
  return n;
}

// incluirBorradores = false (lo normal): las obras con publicada:false no salen en el sitio
function cargarObras({ incluirBorradores = false, dir = path.join(RAIZ, 'content/obras') } = {}) {
  return archivos(dir).map(f => ({ j: leerJson(path.join(dir, f)), id: f.replace(/\.json$/, '') }))
    .filter(({ j }) => incluirBorradores || j.publicada !== false)
    .sort((a, b) => (a.j.orden ?? 9999) - (b.j.orden ?? 9999) || a.id.localeCompare(b.id))
    .map(({ j, id }) => obraALegacy(j, id));
}

function cargarNovedades({ incluirBorradores = false, dir = path.join(RAIZ, 'content/novedades') } = {}) {
  return archivos(dir).map(f => ({ j: leerJson(path.join(dir, f)), id: f.replace(/\.json$/, '') }))
    .filter(({ j }) => incluirBorradores || j.publicada !== false)
    .map(({ j, id }) => novedadALegacy(j, id));
}

function cargarCifras(file = path.join(RAIZ, 'content/empresa/cifras.json')) {
  return fs.existsSync(file) ? (leerJson(file).cifras || []).filter(c => c && c.etiqueta && Number.isFinite(c.valor)) : [];
}

// Hitos de la línea de tiempo del inicio: [{ anio, texto }] ordenados por año
function cargarTrayectoria(file = path.join(RAIZ, 'content/empresa/trayectoria.json')) {
  return fs.existsSync(file)
    ? (leerJson(file).hitos || []).filter(h => h && Number.isFinite(h.anio) && h.texto).sort((a, b) => a.anio - b.anio) : [];
}

module.exports = { cargarObras, cargarNovedades, cargarCifras, cargarTrayectoria, videosALegacy, parrafos };
