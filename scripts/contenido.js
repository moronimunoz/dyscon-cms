/* contenido.js - lee content/*.json y los devuelve en el MISMO formato que hoy tienen
   OBRAS y NOVEDADES en obras-data.js / novedades-data.js. Lo usan build.js y migrar-datos.js. */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const leerJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const archivos = dir => fs.existsSync(dir)
  ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort() : [];

// [{youtube}|{archivo, poster, vertical, titulo}]  ->  formato que entiende video.js
function videosALegacy(lista) {
  const salida = (lista || []).map(v => {
    if (v.youtube) return v.youtube;
    const o = { src: v.archivo };
    if (v.poster) o.poster = v.poster;
    if (v.vertical) o.vertical = true;
    if (v.titulo) o.titulo = v.titulo;
    return Object.keys(o).length === 1 ? o.src : o;
  });
  return salida.length === 0 ? undefined : salida.length === 1 ? salida[0] : salida;
}

function obraALegacy(j, id) {
  const o = { id, nombre: j.nombre, categoria: j.categoria, tipo: j.tipo || 'propia', estado: j.estado };
  const poner = (k, v) => { if (v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length)) o[k] = v; };
  poner('con', j.con); o.comitente = j.comitente || ''; poner('ubicacion', j.ubicacion); poner('mapa', j.mapa);
  poner('destacada', j.destacada); poner('resumen', j.resumen);
  o.descripcion = j.descripcion || [];
  const datos = [];
  if (j.superficie) datos.push('Superficie: ' + j.superficie);
  if (j.plazo) datos.push('Plazo: ' + j.plazo);
  (j.datos_extra || []).forEach(d => datos.push(d));
  poner('datos', datos);
  poner('miniatura', j.miniatura); poner('portada', j.portada);   // rutas completas dentro de img/obras/
  o.fotos = j.fotos || [];
  poner('video', videosALegacy(j.videos));
  return o;
}

function novedadALegacy(j, id) {
  const n = { id, titulo: j.titulo, categoria: j.categoria, fecha: j.fecha, portada: j.portada,
    resumen: j.resumen || '', texto: j.texto || [], fotos: j.fotos || [] };
  const v = videosALegacy(j.videos); if (v !== undefined) n.video = v;
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

module.exports = { cargarObras, cargarNovedades, videosALegacy };
