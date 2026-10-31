/* Dibuja la página de una obra a partir de obras-data.js
   Se usa así: obra.html?id=casa-m */
(function () {
  const main = document.getElementById('detalle');
  // En las páginas generadas por build.js el id viene en <body data-id>; en obra.html?id=... viene de la dirección
  const id = document.body.dataset.id || new URLSearchParams(location.search).get('id');
  const o = OBRAS.find(x => x.id === id);

  if (!o) {
    main.innerHTML = `<section class="contenedor ficha"><h1>Obra no encontrada</h1>
      <p><a href="obras.html" class="link-flecha">Volver a Obras <svg class="icon"><use href="#i-flecha"/></svg></a></p></section>`;
    return;
  }

  document.title = `${o.nombre} | DyScon S.A.`;

  // Las páginas generadas por build.js ya traen su canonical; solo se agrega si falta (obra.html?id=...)
  if (!document.querySelector('link[rel="canonical"]')) {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = 'https://dysconsa.com.ar/obra.html?id=' + o.id;
    document.head.appendChild(canonical);
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const limpiar = t => t.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    const resumen = o.resumen
      ? limpiar(o.resumen)
      : (o.descripcion && o.descripcion[0])
        ? limpiar(o.descripcion[0])
        : `${o.categoria}${o.ubicacion ? ' en ' + o.ubicacion : ''}. Obra de DyScon S.A.`;
    metaDesc.setAttribute('content', `${o.nombre}: ${resumen}`.slice(0, 155));
  }

  // Una fila "título | contenido". Si no hay contenido, no se muestra.
  const fila = (titulo, html) => html ? `<div class="ficha-fila"><h2>${titulo}</h2><div>${html}</div></div>` : '';

  const pasos = [['inicio', 'Inicio'], ['obra', 'En obra'], ['terminado', 'Terminado']];
  const estados = `<div class="estados">${pasos.map(([k, t]) =>
    `<span class="${k === o.estado ? 'activo' : ''}">${k === 'obra' && o.estado === 'obra' ? '<i class="en-curso en-curso--inline"></i>' : ''}${t}</span>`
  ).join('')}</div>`;

  const modalidad = o.tipo === 'colaboracion'
    ? `<p>Unión Transitoria${o.con ? ' con: ' + o.con : ' (UT)'}</p>`
    : '<p>Obra propia.</p>';

  const base = 'img/obras/' + (o.carpeta ? o.carpeta + '/' : '');
  const fotos = crearGaleria(o.fotos, base, o.nombre);

  // El número es el zoom: 14 muestra el barrio, 16 la cuadra y 18 casi el edificio
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(o.mapa || o.ubicacion)}&z=16&output=embed`;

  const videos = crearVideos(o.video, o.nombre, 'img/obras/');

  main.innerHTML = `
    <section class="page-hero">
      <div class="contenedor">
        <p class="migas"><a href="index.html">Inicio</a> / <a href="obras.html">Obras</a> / ${o.nombre}</p>
        <div class="chips"><span class="chip">${o.categoria}</span>${o.tipo === 'colaboracion' ? '<span class="chip chip--ut" title="Unión Transitoria" aria-label="Unión Transitoria">UT</span>' : ''}</div>
        <h1>${o.nombre}</h1>
        ${o.ubicacion ? `<p>${o.ubicacion}</p>` : ''}
      </div>
    </section>
    <section class="contenedor ficha">
      ${fila('Comitente', o.comitente && `<p>${o.comitente}</p>`)}
      ${fila('Estado', estados)}
      ${fila('Modalidad', modalidad)}
      ${fila('Descripción', o.descripcion && o.descripcion.map(p => `<p>${p}</p>`).join(''))}
      ${fila('Objetivos y datos', o.datos && `<ul class="ficha-datos">${o.datos.map(d => `<li>${d}</li>`).join('')}</ul>`)}
      ${fila('Galería de fotos', fotos)}
      ${fila([].concat(o.video || []).length > 1 ? 'Videos' : 'Video', videos)}
      ${fila('Ubicación', (o.mapa || o.ubicacion) && `<div class="mapa"><iframe src="${mapa}" title="Mapa: ${o.nombre}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`)}
      <p class="ficha-volver"><a href="obras.html" class="link-flecha">Volver a todas las obras <svg class="icon"><use href="#i-flecha"/></svg></a></p>
    </section>`;

  // El orden de las elementos se definen dentro de este section de arriba
  // Foto de fondo en la franja del título (portada, o si no la primera foto de la galería)
  const hero = main.querySelector('.page-hero');
  const primera = main.querySelector('.galeria button');
  const portada = o.portada ? `img/obras/${o.portada}` : (primera && primera.dataset.orig);
  if (hero && portada) {
    hero.classList.add('page-hero--img');
    hero.insertAdjacentHTML('afterbegin', '<div class="hero-fondo"></div>');
    ponerFondo(hero.querySelector('.hero-fondo'), portada);   // js/visor.js: versión grande, o la original si falta
  }

  //Visor de fotos ampliadas (con flechas y puntos: js/visor.js)
  iniciarVisor(main.querySelectorAll('.galeria button'));
})();