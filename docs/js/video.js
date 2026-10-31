/* Arma los videos de las fichas de obras y de novedades.
   Lo usan obra.js y novedad.js:  crearVideos(lista, titulo, rutaPoster)

   Cada video ("v") puede ser:
     'c6oSxMGdOtA'                                          -> código de YouTube
     'novedades/nodo.mp4'                                   -> archivo de la carpeta video/
     'https://sitio.com/nodo.mp4'                           -> dirección completa de un .mp4 / .webm
     { src: 'novedades/nodo.mp4', poster: 'nodo.jpg' }      -> archivo con portada propia
     { src: 'novedades/charla.mp4', poster: 'charla.jpg', vertical: true, titulo: 'Charla' }
                                                            -> video vertical (tipo Reels / Shorts)
   "lista" puede ser un solo video o una lista. Los verticales que están seguidos se muestran juntos
   en una fila de tarjetas 9:16; los demás, uno debajo del otro, a lo ancho.
   "rutaPoster" es la carpeta de imágenes donde está la portada ('img/novedades/' o 'img/obras/').
   La portada solo se usa en videos de archivo: YouTube pone su propia imagen. */

function crearVideo(v, titulo, rutaPoster) {
  const item = typeof v === 'string' ? { src: v } : v;
  const src = item.src || '';
  const t = String(item.titulo || titulo).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const clase = item.vertical ? 'video video--vertical' : 'video';
  const esUrl = x => /^https?:\/\//.test(x);

  if (/\.(mp4|webm)$/i.test(src)) {
    const url = esUrl(src) ? src : 'video/' + src;
    const tipo = /\.webm$/i.test(src) ? 'video/webm' : 'video/mp4';
    const poster = item.poster
      ? ` poster="${esUrl(item.poster) ? item.poster : (rutaPoster || '') + item.poster}"`
      : '';
    // Sin portada propia, "#t=0.1" hace que iPhone muestre un cuadro del video en vez de un recuadro negro
    const fuente = item.poster ? url : url + '#t=0.1';
    return `<div class="${clase}"><video controls playsinline preload="metadata"${poster} aria-label="Video: ${t}"><source src="${fuente}" type="${tipo}">Tu navegador no puede reproducir este video.</video></div>`;
  }

  return `<div class="${clase}"><iframe src="https://www.youtube.com/embed/${src}" title="Video: ${t}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
}

function crearVideos(lista, titulo, rutaPoster) {
  const items = [].concat(lista || []);
  let salida = '';
  let fila = [];                                     // verticales seguidos, que van en la misma fila
  const cerrarFila = () => {
    if (fila.length) salida += `<div class="videos-verticales">${fila.join('')}</div>`;
    fila = [];
  };
  items.forEach(v => {
    const html = crearVideo(v, titulo, rutaPoster);
    if (typeof v === 'object' && v.vertical) fila.push(html);
    else { cerrarFila(); salida += html; }
  });
  cerrarFila();
  return salida;
}

// Al reproducir un video se pausan los demás de la página (así no suenan dos a la vez)
document.addEventListener('play', e => {
  if (!e.target.matches || !e.target.matches('.video video')) return;
  document.querySelectorAll('.video video').forEach(otro => { if (otro !== e.target) otro.pause(); });
}, true);
