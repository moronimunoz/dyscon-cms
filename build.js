#!/usr/bin/env node
/* =========================================================
   build.js - genera una página estática por cada obra y novedad
   Uso (desde la raíz del repositorio, al lado de la carpeta docs):   node build.js

   Qué hace:
   - Lee los datos de content/ (obras, novedades y cifras: se editan desde el panel Pages CMS).
   - Regenera docs/js/obras-data.js y docs/js/novedades-data.js, que el sitio carga como siempre
     (ya NO se editan a mano) y actualiza las cifras de docs/nosotros.html.
   - Las obras/novedades con publicada:false (borradores) no salen en el sitio.
   - Copia docs/obra.html y docs/novedad.html como plantilla y crea:
       docs/obra-<id>.html       docs/novedad-<id>.html
     cada una con su <title>, descripción, canonical, Open Graph (WhatsApp, LinkedIn, Facebook)
     y datos estructurados. El contenido sigue dibujándose con obra.js / novedad.js.
   - Calcula la ubicación de cada obra para el mapa (scripts/ubicaciones.js) y las obras relacionadas de cada ficha.
   - Actualiza en docs/index.html las cifras, el rango de años y la línea de tiempo (content/empresa/).
   - Crea docs/sitemap.xml y docs/robots.txt.
   Los archivos generados empiezan con "obra-" y "novedad-": se borran y se rehacen en cada corrida.
   ========================================================= */
const fs = require('fs');
const path = require('path');
const { cargarObras, cargarNovedades, cargarCifras, cargarTrayectoria } = require('./scripts/contenido');
const { resolverCoordenadas } = require('./scripts/ubicaciones');

/* ---------- CONFIGURACIÓN ---------- */
// Dirección pública del sitio, SIN barra final. Cuando conecten dysconsa.com.ar, cambiala acá
// (o corré:  SITE_URL=https://dysconsa.com.ar node build.js)
const SITE = (process.env.SITE_URL || 'https://moronimunoz.github.io/dyscon').replace(/\/+$/, '');
const DOCS = path.join(__dirname, process.env.DOCS_DIR || 'docs');
const EMPRESA = 'DyScon S.A.';
const IMAGEN_POR_DEFECTO = 'img/logo-rectangular.png';   // si una obra/novedad no tiene foto
const PAGINAS_FIJAS = ['index.html', 'obras.html', 'novedades.html', 'nosotros.html', 'contacto.html'];

/* ---------- Utilidades ---------- */
const leer = f => fs.readFileSync(path.join(DOCS, f), 'utf8');

const esc = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const limpiar = t => String(t).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const recortar = (t, n = 155) => t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '') + '…';
const urlAbs = ruta => /^https?:\/\//.test(ruta) ? ruta : `${SITE}/${ruta.split('/').map(encodeURIComponent).join('/')}`;
const fechaLarga = f => new Date(f + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
const idValido = id => /^[A-Za-z0-9_-]+$/.test(id);

const sinTildes = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const ciudadDe = o => sinTildes(String(o.ubicacion || '').split(/\s*·\s*/)[0]);

// Obras parecidas a "o": misma categoría (4 puntos), misma ciudad (2) y mismo tipo (1). Si empatan, van primero
// las que siguen a "o" en el listado, así cada ficha muestra obras distintas. Siempre devuelve "n" obras (si hay tantas).
function relacionadas(o, todas, n = 3) {
  const pos = todas.findIndex(x => x.id === o.id);
  return todas.map((x, i) => ({ x, distancia: (i - pos + todas.length) % todas.length }))
    .filter(({ x }) => x.id !== o.id)
    .map(r => ({ ...r, puntos: (sinTildes(r.x.categoria) === sinTildes(o.categoria) ? 4 : 0) + (ciudadDe(r.x) && ciudadDe(r.x) === ciudadDe(o) ? 2 : 0) + (r.x.tipo === o.tipo ? 1 : 0) }))
    .sort((a, b) => b.puntos - a.puntos || a.distancia - b.distancia)
    .slice(0, n).map(r => r.x);
}

// Reemplaza lo que hay entre <!-- nombre:inicio --> y <!-- nombre:fin --> (marcas que están en el HTML)
function entreMarcas(html, nombre, contenido, archivo, avisos) {
  const re = new RegExp(`(<!--\\s*${nombre}:inicio\\s*-->)[\\s\\S]*?(<!--\\s*${nombre}:fin\\s*-->)`);
  if (!re.test(html)) { avisos.push(`${archivo} no tiene las marcas <!-- ${nombre}:inicio --> y <!-- ${nombre}:fin -->: no se actualizó esa parte.`); return html; }
  return html.replace(re, (m, a, b) => a + contenido + b);
}

// Foto para compartir: la versión de 1200 x 630 (img/og/..., la crea optimizar-imagenes.js) si existe; si no, la original
const fotoParaCompartir = ruta => {
  const og = 'img/og/' + ruta.replace(/^img\//, '').replace(/\.(jpe?g|png|webp)$/i, '.jpg');
  return /^img\/(obras|novedades)\//.test(ruta) && fs.existsSync(path.join(DOCS, og)) ? og : ruta;
};

/* ---------- Genera una página a partir de la plantilla ---------- */
function crearPagina(plantilla, p) {
  const url = `${SITE}/${p.archivo}`;
  const cabeza = `
    <meta name="description" content="${esc(p.descripcion)}">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="${p.og}">
    <meta property="og:site_name" content="${EMPRESA}">
    <meta property="og:locale" content="es_AR">
    <meta property="og:title" content="${esc(p.titulo)}">
    <meta property="og:description" content="${esc(p.descripcion)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${esc(urlAbs(p.imagen))}">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">${JSON.stringify(p.jsonld).replace(/</g, '\\u003c')}</script>
  `;
  return plantilla
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(p.titulo)} | ${EMPRESA}</title>`)
    .replace(/\s*<meta name="description"[^>]*>/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace('</head>', () => cabeza + '</head>')
    .replace(/<body([^>]*)>/, (m, attrs) => `<body${attrs} data-id="${esc(p.id)}">`)
    // Contenido mínimo para buscadores y para quien no tenga JS; el script lo reemplaza al cargar
    .replace(/<main id="detalle">[\s\S]*?<\/main>/, () => `<main id="detalle">${p.respaldo}</main>`);
}

const migas = items => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, ruta], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${SITE}/${ruta}` }))
});

/* ---------- Proceso ---------- */
const OBRAS = cargarObras();          // solo las publicadas, ordenadas
const NOVEDADES = cargarNovedades();  // solo las publicadas
const avisos = [];

// Datos para las fichas y el mapa: ubicación de cada obra y obras relacionadas (ver arriba)
const UBICACIONES = resolverCoordenadas(OBRAS, { avisos });
OBRAS.forEach(o => {
  const u = UBICACIONES[o.id];
  if (u) { o.coords = u.coords; if (u.aprox) o.aprox = true; }
  o.relacionadas = relacionadas(o, OBRAS).map(r => r.id);
});

// Archivos de datos que lee el sitio (generados: no editar a mano)
const generado = (dir) => `/* ARCHIVO GENERADO por build.js a partir de content/${dir}/ - NO EDITAR A MANO (se pisa en cada corrida).\n   Para cambiar datos usá el panel de Pages CMS. */\n`;
fs.writeFileSync(path.join(DOCS, 'js/obras-data.js'), generado('obras') + 'const OBRAS = ' + JSON.stringify(OBRAS, null, 2) + ';\n');
fs.writeFileSync(path.join(DOCS, 'js/novedades-data.js'), generado('novedades') + 'const NOVEDADES = ' + JSON.stringify(NOVEDADES, null, 2) + ';\n');

// Cifras y línea de tiempo: la misma fuente (content/empresa/) alimenta "Nosotros" y el inicio
const CIFRAS = cargarCifras();
const HITOS = cargarTrayectoria();
const ICONOS_INICIO = ['calendario', 'escudo', 'edificio', 'casa'];   // íconos de las cifras que se muestran en el inicio, en orden
const aniosCifra = CIFRAS.find(c => /a[ñn]os/i.test(c.etiqueta));      // "Más de 20 años" en textos y descripciones

// "Nosotros": se reescriben los <li> con el mismo marcado de siempre
if (CIFRAS.length && fs.existsSync(path.join(DOCS, 'nosotros.html'))) {
  const li = CIFRAS.map(c => `        <li class="reveal"><b>+<span class="num" data-valor="${c.valor}">${c.valor}</span></b><span>${esc(c.etiqueta)}</span></li>`).join('\n');
  let html = leer('nosotros.html')
    .replace(/<!-- DYSCON EN CIFRAS[^>]*-->/, '<!-- DYSCON EN CIFRAS (generado por build.js desde content/empresa/cifras.json: se edita desde el panel) -->')
    .replace(/(<ul class="cifras-lista">\n)[\s\S]*?(\n      <\/ul>)/, (m, a, b) => a + li + b);
  if (aniosCifra) html = html.replace(/([Mm]ás de )\d+( años)/g, `$1${aniosCifra.valor}$2`);
  fs.writeFileSync(path.join(DOCS, 'nosotros.html'), html);
}

// Inicio: cifras marcadas "Mostrar en el inicio", texto "Más de N años" y línea de tiempo
if (fs.existsSync(path.join(DOCS, 'index.html'))) {
  let html = leer('index.html');
  const enInicio = CIFRAS.filter(c => c.inicio);
  if (enInicio.length) {
    const li = enInicio.map((c, i) => `\n        <li><svg class="icon icon--lg"><use href="#i-${ICONOS_INICIO[i] || 'escudo'}"/></svg><span><strong>+${c.valor.toLocaleString('es-AR')}</strong> ${esc(c.etiqueta)}</span></li>`).join('') + '\n        ';
    html = entreMarcas(html, 'CIFRAS-INICIO', li, 'index.html', avisos);
  } else avisos.push('Ninguna cifra tiene marcado "Mostrar en el inicio": el inicio conserva las cifras que ya tenía.');
  if (aniosCifra) html = html.replace(/([Mm]ás de )\d+( años)/g, `$1${aniosCifra.valor}$2`);
  if (HITOS.length) {
    const li = HITOS.map(h => `\n        <li><b>${h.anio}</b><span>${esc(h.texto)}</span></li>`).join('') + '\n      ';
    html = entreMarcas(html, 'HITOS', li, 'index.html', avisos);
    html = entreMarcas(html, 'RANGO', `${HITOS[0].anio} – ${HITOS[HITOS.length - 1].anio}`, 'index.html', avisos);
    html = entreMarcas(html, 'FUNDACION', String(HITOS[0].anio), 'index.html', avisos);
  }
  fs.writeFileSync(path.join(DOCS, 'index.html'), html);
}

// Controles de calidad: se informan como avisos en la pestaña Actions de GitHub
const existe = r => fs.existsSync(path.join(DOCS, r));
OBRAS.forEach(o => {
  const fotos = [...(o.fotos || []), o.miniatura, o.portada].filter(Boolean);
  if (!fotos.length) avisos.push(`La obra "${o.id}" está publicada pero no tiene fotos.`);
  if (fotos.some(f => /^provisorio\//.test(f))) avisos.push(`La obra "${o.id}" está publicada con la foto provisoria.`);
  fotos.filter(f => !existe('img/obras/' + f)).forEach(f => avisos.push(`La obra "${o.id}" usa una foto que no existe: img/obras/${f}`));
});
NOVEDADES.forEach(n => {
  if (!n.portada) avisos.push(`La novedad "${n.id}" no tiene imagen principal.`);
  [n.portada, ...(n.fotos || [])].filter(f => f && !existe('img/novedades/' + f)).forEach(f => avisos.push(`La novedad "${n.id}" usa una foto que no existe: img/novedades/${f}`));
});

// Borra lo generado antes, para que no queden páginas de obras que ya no existen
fs.readdirSync(DOCS).filter(f => /^(obra|novedad)-.+\.html$/.test(f)).forEach(f => fs.unlinkSync(path.join(DOCS, f)));

const urls = PAGINAS_FIJAS.filter(f => fs.existsSync(path.join(DOCS, f))).map(f => ({ loc: f === 'index.html' ? '' : f }));
let nObras = 0, nNovedades = 0;

// ----- Obras -----
if (fs.existsSync(path.join(DOCS, 'obra.html'))) {
  const plantilla = leer('obra.html');
  const vistos = new Set();
  OBRAS.forEach(o => {
    if (!idValido(o.id || '') || vistos.has(o.id)) { avisos.push(`Obra con id inválido o repetido: "${o.id}"`); return; }
    vistos.add(o.id);

    const base = 'img/obras/' + (o.carpeta ? o.carpeta + '/' : '');
    const foto = o.portada ? 'img/obras/' + o.portada : (o.fotos && o.fotos[0]) ? base + o.fotos[0] : IMAGEN_POR_DEFECTO;
    const resumen = o.resumen ? limpiar(o.resumen)
      : (o.descripcion && o.descripcion[0]) ? limpiar(o.descripcion[0])
        : `${o.categoria}${o.ubicacion ? ' en ' + o.ubicacion : ''}. Obra de ${EMPRESA}.`;
    const descripcion = recortar(`${o.nombre}: ${resumen}`);
    const archivo = `obra-${o.id}.html`;

    const respaldo = `<section class="contenedor ficha"><h1>${o.nombre}</h1>`
      + (o.ubicacion ? `<p>${o.ubicacion}</p>` : '')
      + (o.descripcion || []).map(t => `<p>${t}</p>`).join('')
      + (o.relacionadas.length ? `<h2>Otras obras</h2><ul>${o.relacionadas.map(id => OBRAS.find(x => x.id === id)).map(r => `<li><a href="obra-${r.id}.html">${r.nombre}</a></li>`).join('')}</ul>` : '')
      + `<p><a href="obras.html">Volver a Obras</a></p></section>`;

    fs.writeFileSync(path.join(DOCS, archivo), crearPagina(plantilla, {
      id: o.id, archivo, titulo: o.nombre, descripcion, imagen: fotoParaCompartir(foto), og: 'article', respaldo,
      jsonld: migas([['Inicio', ''], ['Obras', 'obras.html'], [o.nombre, archivo]])
    }));
    urls.push({ loc: archivo });
    nObras++;
  });
} else avisos.push('No encontré docs/obra.html: no se generaron páginas de obras.');

// ----- Novedades -----
if (fs.existsSync(path.join(DOCS, 'novedad.html'))) {
  const plantilla = leer('novedad.html');
  const vistos = new Set();
  NOVEDADES.forEach(n => {
    if (!idValido(n.id || '') || vistos.has(n.id)) { avisos.push(`Novedad con id inválido o repetido: "${n.id}"`); return; }
    vistos.add(n.id);

    const foto = n.portada ? 'img/novedades/' + n.portada : IMAGEN_POR_DEFECTO;
    const resumen = n.resumen ? limpiar(n.resumen) : limpiar((n.texto && n.texto[0]) || n.titulo);
    const descripcion = recortar(resumen);
    const archivo = `novedad-${n.id}.html`;

    const respaldo = `<section class="contenedor ficha nota"><h1>${n.titulo}</h1>`
      + `<p><time datetime="${n.fecha}">${fechaLarga(n.fecha)}</time></p>`
      + (n.texto || []).map(t => `<p>${t}</p>`).join('')
      + `<p><a href="novedades.html">Volver a Novedades</a></p></section>`;

    fs.writeFileSync(path.join(DOCS, archivo), crearPagina(plantilla, {
      id: n.id, archivo, titulo: n.titulo, descripcion, imagen: fotoParaCompartir(foto), og: 'article', respaldo,
      jsonld: {
        '@context': 'https://schema.org', '@type': 'NewsArticle',
        headline: n.titulo, datePublished: n.fecha, image: [urlAbs(fotoParaCompartir(foto))], description: descripcion,
        author: { '@type': 'Organization', name: EMPRESA }, publisher: { '@type': 'Organization', name: EMPRESA },
        mainEntityOfPage: `${SITE}/${archivo}`
      }
    }));
    urls.push({ loc: archivo, lastmod: n.fecha });
    nNovedades++;
  });
} else avisos.push('No encontré docs/novedad.html: no se generaron páginas de novedades.');

// ----- sitemap.xml y robots.txt -----
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}/${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DOCS, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(DOCS, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Listo: ${nObras} obras, ${nNovedades} novedades, ${urls.length} direcciones en sitemap.xml`);
console.log(`Sitio: ${SITE}`);
avisos.forEach(a => console.log(`::warning::${a}`));   // formato de GitHub Actions: aparece como aviso amarillo en la corrida