/* ubicaciones.js - saca las coordenadas de cada obra para el mapa de obras.html.
   Son dos pasos separados:
     - scripts/geocodificar.js (con internet): busca en OpenStreetMap las direcciones y ciudades nuevas
       y las guarda en scripts/geocache.json. Cada dirección se busca UNA sola vez.
     - build.js (sin internet): usa resolverCoordenadas() y lee solo el caché.
   El resultado queda en docs/js/obras-data.js como  coords: [lat, lng]
   (y aprox: true cuando solo se conoce la ciudad, no el lugar exacto).

   Para cada obra prueba, en este orden, y se queda con lo primero que funcione:
     1. Campo "mapa" con coordenadas:      -32.9817, -60.6292
     2. Campo "mapa" con un código de Google ("Plus Code"):   X98V+JHG Villa Gdor. Gálvez, Santa Fe
     3. Campo "mapa" con una dirección:    Arturo Illia 1690, Rosario, Santa Fe
        -> se busca en OpenStreetMap (Nominatim); el resultado queda en scripts/geocache.json
     4. Campo "ubicacion" ("Rosario · Santa Fe"): el centro de la ciudad (ubicación aproximada)
   Si una dirección no se encuentra o cae lejos de la ciudad indicada, se usa la ciudad.
   Si una dirección todavía no está en el caché, se usa la ciudad hasta que corra geocodificar.js.

   UBICACIONES EXTRA: una obra que está en varios lugares (por ejemplo, plazas en distintos barrios) tiene la
   ubicación principal en "mapa" y las demás en "ubicaciones_extra" [{ nombre, mapa }]. Cada extra se ubica
   igual que "mapa" (coordenadas, código de Google o dirección), tomando la ciudad de la obra como referencia.
   La principal es la única que se ve en el mapa de la ficha; las extra salen solo en el mapa de obras.html. */
const fs = require('fs');
const path = require('path');

const CACHE = path.join(__dirname, 'geocache.json');
const AGENTE = 'dyscon-cms-build/1.0 (https://github.com/moronimunoz/dyscon-cms)';   // Nominatim pide identificarse
const DISTANCIA_MAX_KM = 40;     // una dirección que cae más lejos que esto de su ciudad se descarta

/* Centro de las ciudades más comunes (alcanza para el paso 4 sin internet y como referencia de los códigos).
   Una ciudad que no esté acá se busca en Nominatim y queda guardada en geocache.json. */
const CIUDADES = {
  'rosario': [-32.9468, -60.6393],
  'villa gobernador galvez': [-33.0236, -60.6283],
  'pinero': [-33.0900, -60.7000],
  'ricardone': [-32.8167, -60.7167],
  'funes': [-32.9172, -60.8139],
  'roldan': [-32.8997, -60.9068],
  'san lorenzo': [-32.7500, -60.7333],
  'arroyo seco': [-33.1544, -60.5073],
  'villa constitucion': [-33.2325, -60.3317],
  'casilda': [-33.0435, -61.1683],
  'santa fe': [-31.6333, -60.7000],
  'rafaela': [-31.2503, -61.4867],
  'esperanza': [-31.4500, -60.9333],
  'venado tuerto': [-33.7456, -61.9688],
  'reconquista': [-29.1500, -59.6500],
  'parana': [-31.7333, -60.5333],
  'ituzaingo': [-34.6583, -58.6667],
  'caba': [-34.6037, -58.3816],
  'ciudad autonoma de buenos aires': [-34.6037, -58.3816],
  'buenos aires': [-34.6037, -58.3816]
};

/* ---------- Utilidades ---------- */
const sinTildes = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const separar = ubicacion => String(ubicacion || '').split(/\s*·\s*/).map(s => s.trim()).filter(Boolean);
const pausa = ms => new Promise(r => setTimeout(r, ms));

// Las ubicaciones extra de una obra, listas para pasar por ubicarObra() (usan la ciudad de la obra como referencia)
const extrasDe = o => (o.ubicaciones_extra || []).map((e, i) => ({
  id: `${o.id} (ubicación extra ${i + 1})`, ubicacion: o.ubicacion, mapa: e.mapa, nombre: e.nombre
}));

function km([lat1, lng1], [lat2, lng2]) {
  const rad = x => x * Math.PI / 180, R = 6371;
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/* ---------- Códigos de Google (Open Location Code / Plus Code) ---------- */
const ALFABETO = '23456789CFGHJMPQRVWX';
const SEPARADOR = '+';

function esCodigoPlus(texto) {
  return /^[23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX]{0,}(\s|$)/i.test(String(texto || '').trim());
}

// Pasa un código completo (con 8 o más dígitos) a [lat, lng] del centro del recuadro
function decodificarCompleto(codigo) {
  const limpio = codigo.replace(SEPARADOR, '').toUpperCase();
  let lat = -90, lng = -180, paso = 20;
  let latTam = 20, lngTam = 20;
  const pares = Math.min(limpio.length, 10);
  for (let i = 0; i < pares; i += 2) {
    lat += ALFABETO.indexOf(limpio[i]) * paso;
    lng += ALFABETO.indexOf(limpio[i + 1]) * paso;
    latTam = lngTam = paso;
    paso /= 20;
  }
  // Dígitos después del par 5 (cuadrícula 4 x 5), si el código es más preciso
  if (limpio.length > 10) {
    let filas = 5, cols = 4, latP = latTam, lngP = lngTam;
    for (let i = 10; i < Math.min(limpio.length, 15); i++) {
      latP /= filas; lngP /= cols;
      const d = ALFABETO.indexOf(limpio[i]);
      lat += Math.floor(d / cols) * latP;
      lng += (d % cols) * lngP;
      latTam = latP; lngTam = lngP;
    }
  }
  return [lat + latTam / 2, lng + lngTam / 2];
}

// Primeros dígitos del código de un punto (alcanza con los primeros 8)
function prefijoDe(lat, lng, largo) {
  let l = Math.min(Math.max(lat, -90), 89.9999999) + 90, g = ((lng + 180) % 360 + 360) % 360, paso = 20, salida = '';
  for (let i = 0; i < largo; i += 2) {
    const a = Math.floor(l / paso), b = Math.floor(g / paso);
    salida += ALFABETO[a] + ALFABETO[b];
    l -= a * paso; g -= b * paso; paso /= 20;
  }
  return salida;
}

// "66G2+6Q" (código corto) + un punto de referencia cercano -> [lat, lng]. Los cortos no traen los primeros dígitos.
function recuperarCodigo(corto, refLat, refLng) {
  const texto = corto.trim().split(/\s+/)[0].toUpperCase();
  const posicion = texto.indexOf(SEPARADOR);
  if (posicion < 0) return null;
  if (posicion >= 8) return decodificarCompleto(texto);                    // ya es completo
  const relleno = 8 - posicion;
  const resolucion = Math.pow(20, 2 - relleno / 2);                         // grados que cubre el dato que falta
  const mitad = resolucion / 2;
  let [lat, lng] = decodificarCompleto(prefijoDe(refLat, refLng, relleno) + texto);
  if (refLat + mitad < lat && lat - resolucion >= -90) lat -= resolucion;
  else if (refLat - mitad > lat && lat + resolucion <= 90) lat += resolucion;
  if (refLng + mitad < lng) lng -= resolucion;
  else if (refLng - mitad > lng) lng += resolucion;
  return [lat, lng];
}

/* ---------- Caché de búsquedas ---------- */
const leerCache = () => { try { return JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch { return {}; } };
const guardarCache = c => fs.writeFileSync(CACHE, JSON.stringify(c, Object.keys(c).sort(), 2) + '\n');

// Códigos postales que confunden al buscador: "S2000 Rosario" -> "Rosario"
const limpiarDireccion = t => String(t).replace(/\b[A-Z]\d{4}[A-Z]{0,3}\b/g, ' ').replace(/\s+/g, ' ').replace(/(\s*,)+/g, ',').replace(/^,|,$/g, '').replace(/,(?=\S)/g, ', ').trim();

/* ---------- Decisión para una obra ----------
   buscar(consulta) devuelve [lat, lng], null (se buscó y no hay nada) o undefined (todavía no se buscó). */
function ubicarObra(o, buscar, avisos) {
  const [ciudad, provincia] = separar(o.ubicacion);
  const centro = CIUDADES[sinTildes(ciudad)]
    || (ciudad ? buscar([ciudad, provincia, 'Argentina'].filter(Boolean).join(', ')) : null) || null;

  const mapa = String(o.mapa || '').trim();
  let coords = null;

  // 1. Coordenadas escritas a mano
  const m = mapa.match(/^(-?\d{1,2}(?:\.\d+)?)\s*[,;]\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (m) coords = [Number(m[1]), Number(m[2])];

  // 2. Código de Google: el corto necesita la ciudad como referencia
  if (!coords && mapa && esCodigoPlus(mapa)) {
    if (mapa.split(/\s+/)[0].indexOf(SEPARADOR) >= 8) coords = recuperarCodigo(mapa, 0, 0);
    else if (centro) coords = recuperarCodigo(mapa, centro[0], centro[1]);
  }

  // 3. Dirección escrita en "mapa"
  if (!coords && mapa && !esCodigoPlus(mapa)) {
    const hallada = buscar(limpiarDireccion(mapa));
    if (hallada && (!centro || km(hallada, centro) <= DISTANCIA_MAX_KM)) coords = hallada;
    else if (hallada) avisos.push(`La dirección de la obra "${o.id}" ("${mapa}") cae a más de ${DISTANCIA_MAX_KM} km de ${ciudad}: se usa el centro de la ciudad.`);
  }

  if (coords) return { coords: coords.map(n => Number(n.toFixed(6))), aprox: false };
  if (centro) return { coords: centro, aprox: true };                       // 4. Solo la ciudad
  return null;
}

/* ---------- Para build.js: sin internet, solo con lo que ya está en el caché ---------- */
// Devuelve { id: { coords: [lat, lng], aprox: bool, extras?: [{ coords, aprox, nombre? }] } }.
// Las obras que no se pueden ubicar no figuran.
function resolverCoordenadas(obras, { avisos = [] } = {}) {
  const cache = leerCache();
  const buscar = q => cache[q];                 // undefined = todavía no se buscó
  const resultado = {};
  obras.forEach(o => {
    const u = ubicarObra(o, buscar, avisos);
    if (!u) { avisos.push(`La obra "${o.id}" no se puede ubicar en el mapa (campo "ubicación": "${o.ubicacion || ''}").`); return; }
    const extras = [];
    extrasDe(o).forEach(x => {
      const r = ubicarObra(x, buscar, avisos);
      if (!r) { avisos.push(`La ${x.id.replace(/^.*\((.*)\)$/, '$1')} de "${o.id}" no se puede ubicar en el mapa.`); return; }
      if (r.aprox) avisos.push(`No se encontró la ${x.id.replace(/^.*\((.*)\)$/, '$1')} de "${o.id}" ("${x.mapa}"): se muestra el centro de la ciudad. Revisá la dirección.`);
      extras.push({ coords: r.coords, aprox: r.aprox, ...(x.nombre ? { nombre: x.nombre } : {}) });
    });
    resultado[o.id] = extras.length ? { ...u, extras } : u;
  });
  return resultado;
}

/* ---------- Para scripts/geocodificar.js: busca en OpenStreetMap lo que falta ---------- */
async function geocodificarPendientes(obras, { avisos = [], log = () => { } } = {}) {
  const cache = leerCache();
  let fallos = 0, ultima = 0, cambios = 0;

  const consultar = async q => {
    const espera = 1100 - (Date.now() - ultima);            // Nominatim permite 1 consulta por segundo
    if (espera > 0) await pausa(espera);
    ultima = Date.now();
    const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=ar&accept-language=es&q=' + encodeURIComponent(q);
    const r = await fetch(url, { headers: { 'User-Agent': AGENTE }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const lista = await r.json();
    return lista.length ? [Number(Number(lista[0].lat).toFixed(6)), Number(Number(lista[0].lon).toFixed(6))] : null;
  };

  // Dos vueltas: la primera busca ciudades y direcciones; la segunda, lo que dependía de una ciudad recién encontrada
  for (let vuelta = 0; vuelta < 2; vuelta++) {
    const faltan = new Set();
    obras.forEach(o => [o, ...extrasDe(o)].forEach(x => ubicarObra(x, q => { if (!(q in cache)) faltan.add(q); return cache[q]; }, [])));
    if (!faltan.size) break;

    for (const q of faltan) {
      if (fallos >= 3) break;
      try {
        cache[q] = await consultar(q);
        cambios++; fallos = 0;
        log(`${cache[q] ? 'ok  ' : 'sin resultado'}  ${q}${cache[q] ? '  ->  ' + cache[q].join(', ') : ''}`);
      } catch (e) {
        fallos++;
        log(`error  ${q}  (${e.message})`);
        if (fallos >= 3) avisos.push('No se pudo consultar OpenStreetMap (' + e.message + '): el mapa usa lo que ya está guardado y el centro de las ciudades.');
      }
    }
  }
  if (cambios) guardarCache(cache);
  return cambios;
}

module.exports = { resolverCoordenadas, geocodificarPendientes, extrasDe, recuperarCodigo, decodificarCompleto, esCodigoPlus, limpiarDireccion };
