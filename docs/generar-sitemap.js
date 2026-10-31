/* Genera sitemap.xml a partir de js/obras-data.js y js/novedades-data.js.
   Uso (desde la carpeta raíz del proyecto, la que tiene index.html):   node generar-sitemap.js
   Corrélo cada vez que agregues, quites o cambies el id de una obra o de una novedad. */
const fs = require('fs');
const vm = require('vm');

const DOMINIO = 'https://dysconsa.com.ar/';      // cambialo si el dominio definitivo es otro

// Lee un archivo de datos (const OBRAS = [...]) sin tener que modificarlo
const cargar = (archivo, nombre) => {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(archivo, 'utf8') + `;this.datos = ${nombre};`, ctx);
  return ctx.datos;
};

const OBRAS = cargar('js/obras-data.js', 'OBRAS');
const NOVEDADES = cargar('js/novedades-data.js', 'NOVEDADES');

const urls = [
  '', 'obras.html', 'novedades.html', 'nosotros.html', 'contacto.html',
  ...OBRAS.map(o => 'obra.html?id=' + encodeURIComponent(o.id)),
  ...NOVEDADES.map(n => 'novedad.html?id=' + encodeURIComponent(n.id))
];

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => `  <url><loc>${DOMINIO}${u}</loc></url>`).join('\n') +
  '\n</urlset>\n';

fs.writeFileSync('sitemap.xml', xml);
console.log(`sitemap.xml listo: ${urls.length} direcciones (${OBRAS.length} obras y ${NOVEDADES.length} novedades).`);
