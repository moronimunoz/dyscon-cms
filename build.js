#!/usr/bin/env node
/* =========================================================
   build.js - genera una página estática por cada obra y novedad
   Uso (desde la raíz del repositorio, al lado de la carpeta docs):   node build.js

   Qué hace:
   - Lee docs/js/obras-data.js y docs/js/novedades-data.js (los mismos que ya editás).
   - Copia docs/obra.html y docs/novedad.html como plantilla y crea:
       docs/obra-<id>.html       docs/novedad-<id>.html
     cada una con su <title>, descripción, canonical, Open Graph (WhatsApp, LinkedIn, Facebook)
     y datos estructurados. El contenido sigue dibujándose con obra.js / novedad.js.
   - Crea docs/sitemap.xml y docs/robots.txt.
   Los archivos generados empiezan con "obra-" y "novedad-": se borran y se rehacen en cada corrida.
   ========================================================= */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

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
const datos = (archivo, variable) => vm.runInNewContext(leer(archivo) + `\n;${variable}`);

const esc = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const limpiar = t => String(t).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const recortar = (t, n = 155) => t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '') + '…';
const urlAbs = ruta => /^https?:\/\//.test(ruta) ? ruta : `${SITE}/${ruta.split('/').map(encodeURIComponent).join('/')}`;
const fechaLarga = f => new Date(f + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
const idValido = id => /^[A-Za-z0-9_-]+$/.test(id);

// Foto para compartir: la versión "-og.jpg" (1200 x 630, la crea optimizar-imagenes.js) si existe; si no, la original
const fotoParaCompartir = ruta => {
  const og = ruta.replace(/\.(jpe?g|png|webp)$/i, '-og.jpg');
  return og !== ruta && fs.existsSync(path.join(DOCS, og)) ? og : ruta;
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
const OBRAS = datos('js/obras-data.js', 'OBRAS');
const NOVEDADES = datos('js/novedades-data.js', 'NOVEDADES');

// Borra lo generado antes, para que no queden páginas de obras que ya no existen
fs.readdirSync(DOCS).filter(f => /^(obra|novedad)-.+\.html$/.test(f)).forEach(f => fs.unlinkSync(path.join(DOCS, f)));

const urls = PAGINAS_FIJAS.filter(f => fs.existsSync(path.join(DOCS, f))).map(f => ({ loc: f === 'index.html' ? '' : f }));
const avisos = [];
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
avisos.forEach(a => console.warn('Aviso: ' + a));